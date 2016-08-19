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

	Employee.addLike = function(employeeId, postId, cb){
		Employee.findOne({fields: {postLiked: true}, where:{id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					// var data = []; //init empty array
					// data.push(instance['postLiked']); //get every posts he has liked
					data = instance['postLiked']; //get every posts he has liked
					postLikedNow = data.toString();
					if(postLikedNow.includes(postId)){
						cb("Post id has been registered, you cannot like a post twice");
					}else{
						postLikedNow = postLikedNow + ',' + postId;
						Employee.updateAll({id: employeeId}, {postLiked: postLikedNow}, //update
						function(err,info){
							Employee.findOne({fields: {postLiked: true}, where:{id: employeeId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
				}				
			});
	};

	Employee.addUnlike = function(employeeId, postId, cb){
		Employee.findOne({fields: {postLiked: true}, where:{id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					var data = []; //init empty array
					data.push(instance['postLiked']); //get every posts he has liked
					postLikedNow = data.toString(); //store all post he has liked now to string
					if(postLikedNow.includes(postId + ',')){
						postLikedNow = postLikedNow.replace(postId + ',','');
					}else {						
						postLikedNow = postLikedNow.replace(',' + postId,'');
					}
					Employee.updateAll({id: employeeId}, {postLiked: postLikedNow}, //update
					function(err,info){
						Employee.findOne({fields: {postLiked: true}, where:{id: employeeId}},
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

	Employee.remoteMethod(
		'getName',
		{
			accepts: {arg: 'id', type: 'string'},
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getName', verb: 'get', source: 'query'},
			description: "Get employee name by id"
		}
	);

	Employee.remoteMethod(
		'addLike',
		{
			accepts: [
					{arg: 'employee id', type: 'string'},
					{arg: 'post id', type: 'string'}
					],
			returns: {arg: 'postLiked', type: 'string', root: true},
			http: {path: '/addLike', verb: 'put'}
		}
	);

	Employee.remoteMethod(
		'addUnlike',
		{
			accepts: [
					{arg: 'employee id', type: 'string'},
					{arg: 'post id', type: 'string'}
					],
			returns: {arg: 'postLiked', type: 'string', root: true},
			http: {path: '/addUnlike', verb: 'put'}
		})
};
