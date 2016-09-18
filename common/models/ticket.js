module.exports = function(Ticket) {
	Ticket.createTicket = function(data, cb){
		Ticket.create(data,
			function(err, instance){
				if(instance===null){
					cb(null, null);
				}else {
					var ticketId = instance['id'];
					Ticket.updateAll({id: ticketId}, {qrcode_link: "http://api.qrserver.com/v1/create-qr-code/?data=" + ticketId},
						function(err, instance){
							if(instance===null){
								cb(null,null);
							}else {
								Ticket.findById(ticketId, 
									function(err, instance){
										if(instance===null){
											cb(null,null);
										}else {
											cb(null, instance);
										}
									})
							}
						});
				}
			})
		
	}

	// Ticket.getTickets = function(eventId, cb){
	// 	var TicketEvent = Ticket.app.models.Event;
	// 	Ticket.find({where: {eventId: eventId}},
	// 		function(err,instance){
	// 			if(instance===null){
	// 				cb(null,null);
	// 			} else {
	// 				var TicketMessage = JSON.stringify(instance);
	// 				console.log(TicketMessage);
	// 				TicketEvent.findOne({where: {id: eventId}},
	// 					function(err, instance){
	// 						if(instance===null){
	// 							cb(null, null);
	// 						}else {
	// 							var EventMessage = JSON.stringify(instance);
	// 							console.log(TicketMessage+EventMessage);
	// 						}
	// 					})
	// 				// var total = []; 
	// 				// // console.log(instance);
	// 				// for(var i in instance){
	// 				// 	var data = [];
	// 				// 	if(instance[i]['sharer'] != ""){ // if sharer is empty
	// 				// 		data = instance[i]['sharer'].split(",");
	// 				// 		total [i] = data.length;
	// 				// 	} else {
	// 				// 		total [i] = 0;
	// 				// 	}
	// 				// }

	// 				// var max = 0;
	// 				// var result; // index of most shared post
	// 				// for (var i in total){
	// 				// 	if(total[i] > max){
	// 				// 		max = total[i];
	// 				// 		result = i;
	// 				// 	}
	// 				// }
					
	// 				// // console.log(result);
	// 				// cb(null,instance[result]);
	// 			}
	// 		}
	// 	);
	// }

	Ticket.remoteMethod(
		'createTicket',
		{
			accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
			returns: {type: 'string', root: 'true'},
			http: {path: '/createTicket', verb: 'post', source: 'query'},
			description: "Create a ticket for specific event"
		}
	);

	// Ticket.remoteMethod(
	// 	'getTickets',
	// 	{
	// 		accepts: {arg: 'eventId', type: 'string'},
	// 		returns: {type: 'string', root: 'true'},
	// 		http: {path: '/getTickets', verb: 'get', source: 'query'},
	// 		description: "Get all the tickets along with their event description"
	// 	}
	// );
};
