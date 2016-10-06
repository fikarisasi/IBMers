module.exports = function(Event) {
	Event.attend= function(employeeId, eventId, cb){
		var TicketEvent = Event.app.models.Ticket;
		var TicketEmployee = Event.app.models.Employee;
		Event.findById(eventId,
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					var theticket_ordererNow = instance['ticket_orderer'].split(","); //get all people who will attend this event
					var eventTitle = instance['title'];
					var eventLocation = instance['location'];
					var eventDateStart = instance['date_started'];
					var eventDateEnd = instance['date_ended'];
					var data = '{"name": "'+ eventTitle +'","employeeId": "'+ employeeId +'","eventId": "'+ eventId +'","location": "'+ eventLocation +'","date_started": "'+ eventDateStart +'","date_ended": "'+ eventDateEnd +'","scan":false}';
					data = JSON.parse(data);
					//if this is the first ticket_orderer
					if(theticket_ordererNow[0]===""){
						theticket_ordererNow[0] = employeeId;
						var theticket_ordererNowString = theticket_ordererNow[0].toString();
						Event.updateAll({id: eventId}, {ticket_orderer: theticket_ordererNowString},
							function(err,instance){
								TicketEvent.create(data,
									function(err, instance){
										var ticketId = instance['id'];
										TicketEvent.updateAll({id: ticketId}, {qrcode_link: "http://api.qrserver.com/v1/create-qr-code/?data="+ ticketId},
											function(err, instance){
												TicketEvent.findById(ticketId,
													function(err,instance){
														var ticketMessage = instance;
														TicketEmployee.findById(employeeId, 
															function(err, info){
																if(info===null){
																	cb(null,null);
																}else{
																	var ticketsNow = info['employeeTicket'].split(","); //get all event not ticket, i'm too lazy to change the variable name
																	if(ticketsNow[0]===""){
																		ticketsNow[0]=eventId;
																		var ticketsNowString = ticketsNow[0].toString();
																		TicketEmployee.updateAll({id: employeeId}, {employeeTicket: ticketsNowString},
																			function(err, instance){
																				cb(null,ticketMessage);
																			});
																	}else{
																		ticketsNow.push(eventId);
																		var ticketsNowString = ticketsNow.toString();
																		TicketEmployee.updateAll({id: employeeId}, {employeeTicket: ticketsNowString},
																			function(err, instance){
																				cb(null,ticketMessage);
																			});
																	}
																}																
															})
														// cb(null,instance);
													})
											})
									})
								// console.log(eventTitle);
							});
					}
					//it's only the last person who will attend
					else{
						theticket_ordererNow.push(employeeId);
						var theticket_ordererNowString = theticket_ordererNow.toString();
						Event.updateAll({id: eventId}, {ticket_orderer: theticket_ordererNowString},
							function(err,instance){
								TicketEvent.create(data,
									function(err, instance){
										var ticketId = instance['id'];
										TicketEvent.updateAll({id: ticketId}, {qrcode_link: "http://api.qrserver.com/v1/create-qr-code/?data="+ ticketId},
											function(err, instance){
												TicketEvent.findById(ticketId,
													function(err,instance){
														var ticketMessage = instance;
														TicketEmployee.findById(employeeId, 
															function(err, info){
																if(info===null){
																	cb(null,null);
																}else{
																	var ticketsNow = info['employeeTicket'].split(","); //get al tickets
																	if(ticketsNow[0]===""){
																		ticketsNow[0]=eventId;
																		var ticketsNowString = ticketsNow[0].toString();
																		TicketEmployee.updateAll({id: employeeId}, {employeeTicket: ticketsNowString},
																			function(err, instance){
																				cb(null,ticketMessage);
																			});
																	}else{
																		ticketsNow.push(eventId);
																		var ticketsNowString = ticketsNow.toString();
																		TicketEmployee.updateAll({id: employeeId}, {employeeTicket: ticketsNowString},
																			function(err, instance){
																				cb(null,ticketMessage);
																			});
																	}
																}																
															});
													});
											});
									});
							});
					}
			}
		});
	}
	Event.readTicket = function(ticketId, cb){
		
	}

Event.getAttendees = function(eventId, cb){
	Event.find({where : {id:eventId}},
		function(err, instance){
			if(instance===null){
				cb(null,null);
			} else {
				console.log(instance);
				var TicketEvent = Event.app.models.Ticket;
				TicketEvent.find({where:{eventId:eventId}},
					function(err,instance){
						if(instance===null){
							cb(null,null);
						} else {
							cb(null,instance);
						}
					}
				)
			}
		}
	)
}

Event.remoteMethod(
	'attend',
	{
		accepts: [
		{arg: 'employeeId', type: 'string'},
		{arg: 'eventId', type: 'string'}
		],
		returns: {type: 'string', root: true},
		http: {path: '/attend', verb: 'put', source: 'query'}
	}
	);

Event.remoteMethod(
	'getAttendees',
	{
		accepts: {arg: 'eventId', type: 'string'},
		returns: {type: 'string', root: true},
		http: {path: '/getAttendees', verb: 'get', source: 'query'}
	}
	);
};
