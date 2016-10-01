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

	Ticket.changeScanStatus = function(id, cb){
		var TicketEvent = Ticket.app.models.Event;
		Ticket.findOne({where: {id : id}},
			function(err, instance){
				if(instance===null){
					cb(null,null);
				} else {
					var scan_status = instance['scan_status'];
					var ticketId = instance['id'];
					var employeeId = instance['employeeId'].toString();
					var eventId = instance['eventId'];
					if(scan_status!="true"){
						Ticket.updateAll({id:ticketId}, {scan_status: true},
							function(err,instance){
								if(instance===null){
									cb(null,null);
								} else {
									TicketEvent.find({where : {id:eventId}},
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												var attendee = [];
												var attendee = instance[0]['attendee'];
												if (attendee===""){
													// var attendee = ;
													// var attendeestring = attendee.toString();
													TicketEvent.updateAll({id:eventId}, {attendee:employeeId},
														function(err, instance){
															message = instance;
															if(instance===null){
																cb(null,null);
															} else {
																console.log(null,message);
															}
														}
													)
												} else {
													// console.log(instance);
														// var attendee = ;
														attendee1 = (instance[0]['attendee']);
														attendee1.push(employeeId);
														TicketEvent.updateAll({id:eventId}, {attendee:attendee1},
															function(err, instance){
																message = instance;
																if(instance===null){
																	cb(null,null);
																} else {
																	cb(null,message);
																}
															}
														)
												}
											}
										}
									)
								}
							}
						)
					} else {
						cb (null, "the ticket has registered as attendee");
					}
				}
			}
		)
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
		'changeScanStatus',
		{
			accepts: {arg: 'id ticket', type: 'string'},
			returns: {type: 'string', root: 'true'},
			http: {path: '/changeScanStatus', verb: 'put', source:'query'},
			description: "For changing status of scan_status of attendee"
		}
	);

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
