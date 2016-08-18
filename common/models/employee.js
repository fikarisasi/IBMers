module.exports = function(Employee) {
	Employee.getName = function(id, cb){
		Employee.findOne({fields: {name: true}, where:{id:id}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
	};

	Employee.remoteMethod(
		'getName',
		{
			accepts: {arg: 'id', type: 'string'},
			returns: {arg: 'name', type: 'string', root: true},
			http: {path: '/getName', verb: 'get', source: 'query'},
			description: "Get employee name by id"
		}
	);
};
