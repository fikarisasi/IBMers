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
		var TicketEvent = Event.app.models.Ticket;
		TicketEvent.updateAll({id: ticketId}, {scan: true}, //update the scan status to true
			function(err, instance){
				TicketEvent.findOne({where: {id: ticketId}}, //get the ticket
					function(err, instance){
						var newAttendee = instance['employeeId'];
						var eventId = instance['eventId']
						Event.findOne({where: {id: eventId}}, //get what event from the ticket to get all the attendee
							function(err, instance){
								var theAttendeeNow = instance['attendee'].split(",");
								//if this is the first attendee
								if(theAttendeeNow[0]===""){
									theAttendeeNow[0] = newAttendee;
									var theAttendeeNowString = theAttendeeNow[0].toString();
									Event.updateAll({id: eventId}, {attendee: theAttendeeNowString}, //update the attendees
										function(err, instance){
											if(instance===null){
												cb(null, null);
											}else{
												cb(null, instance);
											}
										});
								}
								//this is the last attendee who attend
								else{
									theAttendeeNow.push(newAttendee);
									var theAttendeeNowString = theAttendeeNow.toString();
									Event.updateAll({id: eventId}, {attendee: theAttendeeNowString}, //update the attendees
										function(err, instance){
											if(instance===null){
												cb(null, null);
											}else{
												cb(null, instance);
											}
										})
								}
							})
					})
			})
		
	}

Event.getAttendees = function(eventId, cb){
	var Employee = Event.app.models.Employee;
	Event.findOne({where : {id:eventId}},
		function(err, instance){
			var ticket_orderer = instance['ticket_orderer'].split(","); //get ticket_orderer as array
			var attendee = instance['attendee']; //get attendee as string
			var attendStatus = [];
			var attendeeMessage = [];
			for(i in ticket_orderer){
				// if(attendee.includes(ticket_orderer[i])){
				// 	attendStatus.push(true);
				// }else{
				// 	attendStatus.push(false);
				// }
				console.log(i==ticket_orderer.length-1);
				if(i==ticket_orderer.length-1){
					Employee.findOne({fields: {name: true, photo: true}, where: {id: ticket_orderer[i]}},
						function(err, instance){
							attendeeMessage.push(instance);
							cb(null,attendeeMessage);
						})
				}
				else{
					Employee.findOne({fields: {name: true, photo: true}, where: {id: ticket_orderer[i]}},
						function(err, instance){
							attendeeMessage.push(instance);
						})
				}
			}
							console.log(attendeeMessage);
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
	'readTicket',
	{
		accepts: {arg: 'ticketId', type: 'string'},
		returns: {type: 'string', root: true},
		http: {path: '/readTicket', verb: 'put', source: 'query'}
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
