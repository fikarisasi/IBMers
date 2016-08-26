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

	Employee.likeCounter = function(employeeId, cb){
		Employee.findOne({fields: {postLiked: true}, where: {id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['postLiked'] === ""){
						cb(null,0);
				}else {
					data = instance['postLiked'].split(",");
					cb(null,data.length);
				}
			});
	};

	Employee.addSeen = function(employeeId, postId, cb){
		Employee.findOne({where:{id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['postSeen']; //get every posts he has seen
					postSeenNow = data.toString();
					//if postId has been seen
					if(postSeenNow.includes(postId)){
						cb(null,instance);
					}
					//if this is the first post he see
					else if(postSeenNow === ''){
						postSeenNow = postId;
						Employee.updateAll({id: employeeId}, {postSeen: postSeenNow}, //update
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
					//it's only the last post he's seen
					else{
						postSeenNow = postSeenNow + ',' + postId;
						Employee.updateAll({id: employeeId}, {postSeen: postSeenNow}, //update
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

	Employee.seenCounter = function(employeeId, cb){
		Employee.findOne({fields: {postSeen: true}, where: {id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['postSeen'] === ""){
						cb(null,0);
				}else {
					data = instance['postSeen'].split(",");
					cb(null,data.length);
				}
			});
	};

	Employee.addShared = function(employeeId, postId, cb){
		Employee.findOne({where:{id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['postShared']; //get every posts he has shared
					postSharedNow = data.toString();
					//if postId has been shared
					if(postSharedNow.includes(postId)){
						cb(null,instance);
					}
					//if this is the first post he share
					else if(postSharedNow === ''){
						postSharedNow = postId;
						Employee.updateAll({id: employeeId}, {postShared: postSharedNow}, //update
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
					//it's only the last post he's shared
					else{
						postSharedNow = postSharedNow + ',' + postId;
						Employee.updateAll({id: employeeId}, {postShared: postSharedNow}, //update
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

	Employee.sharedCounter = function(employeeId, cb){
		Employee.findOne({fields: {postShared: true}, where: {id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['postShared'] === ""){
						cb(null,0);
				}else {
					data = instance['postShared'].split(",");
					cb(null,data.length);
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
		}
	);

	Employee.remoteMethod(
		'likeCounter',
		{
			accepts: {arg: 'employeeId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/likeCounter', verb: 'get', source: 'query'},
			description: "Get how many post Employee{id} has liked"
		}
	);

	Employee.remoteMethod(
		'seenCounter',
		{
			accepts: {arg: 'employeeId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/seenCounter', verb: 'get', source: 'query'},
			description: "Get how many post Employee{id} has seen"
		}
	);

	Employee.remoteMethod(
		'sharedCounter',
		{
			accepts: {arg: 'employeeId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/sharedCounter', verb: 'get', source: 'query'},
			description: "Get how many post Employee{id} has shared"
		}
	);

	Employee.remoteMethod(
		'addSeen',
		{
			accepts: [
					{arg: 'employeeId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postSeen', type: 'string', root: true},
			http: {path: '/addSeen', verb: 'put'}
		}
	);

	Employee.remoteMethod(
		'addShared',
		{
			accepts: [
					{arg: 'employeeId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postSeen', type: 'string', root: true},
			http: {path: '/addShared', verb: 'put'}
		}
	);
};
