// save old method to getPostByRole
// module.exports = function(Post) {
// 	Post.getPostByRole = function(role,cb){
// 		Post.find({where: {receiver: {like: role}}},
// 			function(err,instance){
// 				if(instance===null){
// 					cb(null,null);
// 				}else{
// 					cb(null,instance);
// 				}
// 			});
// 	};

// 	Post.remoteMethod(
// 		'getPostByRole',
// 		{
// 			accepts: {arg: 'role', type: 'string'},
// 			returns: {
// 				arg: 'id', type: 'string', root: true
// 			},
// 			http: {path: '/getPostByRole', verb: 'get', source: 'query'},
// 			description: "Get all posts by user role"
// 		}
// 	);
// };

module.exports = function(Post) {
	Post.getPostByRole = function(role,cb){
		if(role === "div_all"){
			Post.find({where: {or: [{or: [{div_all: true}, {div_jti: true}]}, {div_gbs: true}]}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
		}else if(role === "div_jti"){
			Post.find({where: {div_jti: true}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
		}else if(role === "div_gbs"){
			Post.find({where: {div_gbs: true}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
		}else {
			cb(null,null);
		}
		
	};

	Post.pagination = function(page, role, cb){
		pagesize = page*10-10;
		if(role==="div_all"){
			Post.find({limit: 10, skip: pagesize, order : 'date DESC', where: {or: [{or: [{div_all: true}, {div_jti: true}]}, {div_gbs: true}]}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
		}else if(role==="div_jti"){
			Post.find({limit: 10, skip: pagesize, order : 'date DESC', where: {div_jti: true}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
		}else if(role==="div_gbs"){
			Post.find({limit: 10, skip: pagesize, order : 'date DESC', where: {div_gbs: true}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
		}else {
			cb(null,null);
		}
		
	};

	Post.addLiker = function(employeeUsername, postId, cb){
		Post.findOne({where:{id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['liker']; //get everyone who has like this post
					theLikersNow = data.toString();
					//if employeeUsername has like this post
					if(theLikersNow.includes(employeeUsername)){
						cb(null,instance);
					}
					//if this is the first post he see
					else if(theLikersNow === ''){
						theLikersNow = employeeUsername;
						Post.updateAll({id: postId}, {liker: theLikersNow}, //update
						function(err,info){
							Post.findOne({where:{id: postId}},
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
						theLikersNow = theLikersNow + ',' + employeeUsername;
						Post.updateAll({id: postId}, {liker: theLikersNow}, //update
						function(err,info){
							Post.findOne({where:{id: postId}},
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

	Post.addUnliker = function(employeeUsername, postId, cb){
		Post.findOne({where:{id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['liker']; //get everyone who has like the post
					theLikersNow = data.toString(); //store all post he has liked now to string
					//if the employeeUsername is in mid
					if(theLikersNow.includes(employeeUsername + ',')){
						theLikersNow = theLikersNow.replace(employeeUsername + ',','');
					}
					//if the employeeUsername at the last
					else if(theLikersNow.includes(',' + employeeUsername)){
						theLikersNow = theLikersNow.replace(',' + employeeUsername,'');
					}
					//employeeUsername is at the first
					else {						
						theLikersNow = theLikersNow.replace(employeeUsername,'');
					}
					Post.updateAll({id: postId}, {liker: theLikersNow}, //update
					function(err,info){
						Post.findOne({where:{id: postId}},
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

	Post.addSeer = function(employeeUsername, postId, cb){
		Post.findOne({where:{id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['seen']; //get everyone who has seen the post
					theSeerNow = data.toString();
					//if employeeUsername has seen the post
					if(theSeerNow.includes(employeeUsername)){
						cb(null,instance);
					}
					//if this is the first person who see
					else if(theSeerNow === ''){
						theSeerNow = employeeUsername;
						Post.updateAll({id: postId}, {seen: theSeerNow}, //update
						function(err,info){
							Post.findOne({where:{id: postId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
					//it's only the last person who has seen
					else{
						theSeerNow = theSeerNow + ',' + employeeUsername;
						Post.updateAll({id: postId}, {seen: theSeerNow}, //update
						function(err,info){
							Post.findOne({where:{id: postId}},
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

	Post.addSharer = function(employeeUsername, postId, cb){
		Post.findOne({where:{id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['sharer']; //get everyone who has seen the post
					theSharerNow = data.toString();
					//if employeeUsername has seen the post
					if(theSharerNow.includes(employeeUsername)){
						cb(null,instance);
					}
					//if this is the first person who see
					else if(theSharerNow === ''){
						theSharerNow = employeeUsername;
						Post.updateAll({id: postId}, {sharer: theSharerNow}, //update
						function(err,info){
							Post.findOne({where:{id: postId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
					//it's only the last person who has seen
					else{
						theSharerNow = theSharerNow + ',' + employeeUsername;
						Post.updateAll({id: postId}, {sharer: theSharerNow}, //update
						function(err,info){
							Post.findOne({where:{id: postId}},
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

	Post.likerCounter = function(postId, cb){
		Post.findOne({fields: {liker: true}, where: {id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['liker'].split(",");
					cb(null,data.length);
				}
			});
	};

	Post.seerCounter = function(postId, cb){
		Post.findOne({fields: {seen: true}, where: {id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['seen'].split(",");
					cb(null,data.length);
				}
			});
	};

	Post.sharerCounter = function(postId, cb){
		Post.findOne({fields: {sharer: true}, where: {id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['sharer'].split(",");
					cb(null,data.length);
				}
			});
	};

	Post.remoteMethod(
		'getPostByRole',
		{
			accepts: {arg: 'role', type: 'string'},
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getPostByRole', verb: 'get', source: 'query'},
			description: "Get all posts by user role"
		}
	);

	Post.remoteMethod(
		'pagination',
		{
			accepts: [
				{arg: 'page', type: 'number'},
				{arg: 'role', type: 'string'}
			],
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/pagination', verb: 'get', source: 'query'},
			description: "Get all posts by pagination"
		}
	);

	Post.remoteMethod(
		'addLiker',
		{
			accepts: [
					{arg: 'employeeUsername', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'liker', type: 'string', root: true},
			http: {path: '/addLiker', verb: 'put'}
		}
	);

	Post.remoteMethod(
		'addUnliker',
		{
			accepts: [
					{arg: 'employeeUsername', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'liker', type: 'string', root: true},
			http: {path: '/addUnliker', verb: 'put'}
		}
	);

	Post.remoteMethod(
		'addSeer',
		{
			accepts: [
					{arg: 'employeeUsername', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postSeen', type: 'string', root: true},
			http: {path: '/addSeer', verb: 'put'}
		}
	);

	Post.remoteMethod(
		'addSharer',
		{
			accepts: [
					{arg: 'employeeUsername', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postSeen', type: 'string', root: true},
			http: {path: '/addSharer', verb: 'put'}
		}
	);

	Post.remoteMethod(
		'likerCounter',
		{
			accepts: {arg: 'postId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/likerCounter', verb: 'get', source: 'query'},
			description: "Get how many Employee who like post{id}"
		}
	);

	Post.remoteMethod(
		'seerCounter',
		{
			accepts: {arg: 'postId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/seerCounter', verb: 'get', source: 'query'},
			description: "Get how many Employee who see post{id}"
		}
	);

	Post.remoteMethod(
		'sharerCounter',
		{
			accepts: {arg: 'postId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/sharerCounter', verb: 'get', source: 'query'},
			description: "Get how many Employee who share post{id}"
		}
	);
};
