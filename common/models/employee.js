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
					data = instance['postLiked']; //get every posts he has liked
					postLikedNow = data.toString();
					//if postId has been liked
					if(postLikedNow.includes(postId)){
						cb("Post id has been registered, you cannot like a post twice");
					}
					//if this is the first post he like
					else if(postLikedNow === ''){
						postLikedNow = postId;
						Employee.updateAll({id: employeeId}, {postLiked: postLikedNow}, //update
						function(err,info){
							Employee.findOne({where:{id: employeeId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
					//it's only the last post he liked
					else{
						postLikedNow = postLikedNow + ',' + postId;
						Employee.updateAll({id: employeeId}, {postLiked: postLikedNow}, //update
						function(err,info){
							Employee.findOne({where:{id: employeeId}},
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
					data = instance['postLiked']; //get every posts he has liked
					postLikedNow = data.toString(); //store all post he has liked now to string
					//if the postId is in mid
					if(postLikedNow.includes(postId + ',')){
						postLikedNow = postLikedNow.replace(postId + ',','');
					}
					//if the postId at the last
					else if(postLikedNow.includes(',' + postId)){
						postLikedNow = postLikedNow.replace(',' + postId,'');
					}
					//postId is at the first
					else {						
						postLikedNow = postLikedNow.replace(postId,'');
					}
					Employee.updateAll({id: employeeId}, {postLiked: postLikedNow}, //update
					function(err,info){
						Employee.findOne({where:{id: employeeId}},
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
					{arg: 'employeeId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postLiked', type: 'string', root: true},
			http: {path: '/addLike', verb: 'put'}
		}
	);

	Employee.remoteMethod(
		'addUnlike',
		{
			accepts: [
					{arg: 'employeeId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postLiked', type: 'string', root: true},
			http: {path: '/addUnlike', verb: 'put'}
		})
};
