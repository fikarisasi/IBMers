module.exports = function(Message) {
	Message.getMessage = function(sender, receiver, cb){
		Message.find({fields: {id:false}, where:{sender: sender, receiver: receiver}}, // get all data except id from database
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					senderMessage = JSON.stringify(instance); // converts a JavaScript value to a JSON string
					var parsed = JSON.parse(senderMessage); // parsing string

					var allMessages = []; // array of string, this variabel combines senderMessage & receiverMessage

					for(var x in parsed){
					  allMessages.push(parsed[x]); // push senderMessage to allMessages
					}

					Message.find({fields: {id:false}, where:{sender: receiver, receiver: sender}},
						function(err,instance){
							if(instance===null){
								cb(null,null);
							}else{
								receiverMessage = JSON.stringify(instance); // converts a JavaScript value to a JSON string
								var parsed2 = JSON.parse(receiverMessage);

								for (var y in parsed2){
									allMessages.push(parsed2[y]); // push receiverMessage to allMessages
								}

								allMessages.sort(function(a, b){ // sorting array by date (ascending)
								    return a.date>b.date;
								})
								// console.log(allMessages);
								cb(null,allMessages);
							}
						});
				}
			});
	};

	Message.addMessage = function(data, cb){
		var Employee = Message.app.models.Employee;
		Message.create(data,
			function(err, instance){
				if(instance===null){
					cb(null, null);
				}else {
					var messageMessage = instance;
					var receiver = instance['receiver'];
					var messageId = instance['id'];
					var messageContent = instance['content'];
					Employee.findOne({fields: {id: false}, where: {username: receiver}},
						function(err, info){
							if(info===null){
								cb(null, null);
							}else{
								var oneSignalId = info['oneSignalId'];
								var sendNotification = function(data) {
								  var headers = {
								    "Content-Type": "application/json",
								    "Authorization": "Basic YzIxZTYwOWEtNmU3Zi00ZTZiLTlhZWEtYjFjYTRhMjA3NzMy"
								  };
								  
								  var options = {
								    host: "onesignal.com",
								    port: 443,
								    path: "/api/v1/notifications",
								    method: "POST",
								    headers: headers
								  };
								  
								  var https = require('https');
								  var req = https.request(options, function(res) {  
								    res.on('data', function(data) {
								      console.log("Response:");
								      console.log(JSON.parse(data));
								      // console.log(JSON.parse(data));
								    });
								  });
								  
								  req.on('error', function(e) {
								    console.log("ERROR:");
								    console.log(e);
								  });
								  
								  req.write(JSON.stringify(data));
								  req.end();
								};

								var message = { 
								  app_id: "0010ee59-1672-4d84-acaf-2256df52939c",
								  contents: {"en": receiver + " : " + messageContent},
								  include_player_ids: [oneSignalId],
								  isAndroid: true,
								  // postId: instance['id']
								  data: {messageId : messageId, type: "message"}
								};

								sendNotification(message);
								// console.log(instance);
								cb(null, messageMessage, message);
							}
						})

					
					
				}
			})
	}

	Message.addReader = function(id, receiver, cb){
		Message.findOne({where:{id:id}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					Message.updateAll({receiver: receiver}, {read:receiver},
					function(err,info){
						Message.findOne({where:{id: id}},
							function(err,instance){
								if(instance===null){
									cb(null,null);
								}else{
									cb(null,instance);
								}
							})
					});
				}
			});
	};


	Message.remoteMethod(
		'getMessage',
		{
			accepts : [
						{arg : 'sender', type: 'string'},
						{arg : 'receiver', type: 'string'}
					],
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getMessage', verb: 'get', source: 'query'}
		}
	);

	Message.remoteMethod(
		'addMessage',
		{
			accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
			returns: [
					{arg: 'dataMessage', type: 'string'},
					{arg: 'messagePush', type: 'string'}
					],
			http: {path: '/addMessage', verb: 'post', source: 'query'},
			description: "Adding a message"
		}
	);

	Message.remoteMethod(
		'addReader',
		{
			accepts: [
						{arg : 'id', type: 'string'},
						{arg : 'receiver', type: 'string'}
					],
			returns: {arg: 'status', type: 'string', root: true},
			http: {path: '/addReader', verb: 'get', source: 'query'}
		}
	);
};
