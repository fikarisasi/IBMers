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
};
