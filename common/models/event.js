module.exports = function(Event) {
	Event.attend= function(employeeId, eventId, cb){
		var TicketEvent = Event.app.models.Ticket;
		var TicketEmployee = Event.app.models.Employee;
		Event.findById(eventId,
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					var theAttendeeNow = instance['attendee'].split(","); //get all people who will attend this event
					var eventTitle = instance['title'];
					var eventLocation = instance['location'];
					var eventDateStart = instance['date_started'];
					var eventDateEnd = instance['date_ended'];
					var data = '{"name": "'+ eventTitle +'","employeeId": "'+ employeeId +'","eventId": "'+ eventId +'","location": "'+ eventLocation +'","date_started": "'+ eventDateStart +'","date_ended": "'+ eventDateEnd +'","scan":false}';
					data = JSON.parse(data);
					//if this is the first attendee
					if(theAttendeeNow[0]===""){
						theAttendeeNow[0] = employeeId;
						var theAttendeeNowString = theAttendeeNow[0].toString();
						Event.updateAll({id: eventId}, {attendee: theAttendeeNowString},
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
						theAttendeeNow.push(employeeId);
						var theAttendeeNowString = theAttendeeNow.toString();
						Event.updateAll({id: eventId}, {attendee: theAttendeeNowString},
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
};
