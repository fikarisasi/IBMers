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

	Ticket.remoteMethod(
		'createTicket',
		{
			accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
			returns: {type: 'string', root: 'true'},
			http: {path: '/createTicket', verb: 'post', source: 'query'},
			description: "Create a ticket for specific event"
		}
	);
};
