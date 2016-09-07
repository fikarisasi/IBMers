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

	Post.addComment = function(postId, employeeId, employeeName, content, cb){
		Post.findOne({where:{id: postId}}, 
			function(err, instance){
				data = instance['comment'];
				date = new Date();
				dateJSON = date.toJSON();
				//if comment is empty -- first comment to be added
				if(data.toString() === "[{}]"){
					newComment = '{"id": "1", "employeeId": "'+employeeId+'", "employeeName": "'+employeeName+'", "content": "'+content+'", "date": "'+dateJSON+'"}';
					Post.updateAll({id: postId}, {comment: '['+newComment+']'},
						function(err,info){
							Post.findOne({where: {id: postId}},
								function(err, instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						})				
				}else{ //last comment to be added
					commentId = data.length + 1; //generate commentId by the number of the comments
					newComment = '{"id": "'+commentId+'", "employeeId": "'+employeeId+'", "employeeName": "'+employeeName+'", "content": "'+content+'", "date": "'+dateJSON+'"}';
					data.push(JSON.parse(newComment)); //add newComment to array by parsing it to Javascript
					commentNow = data.toString();
					Post.updateAll({id: postId}, {comment: commentNow},
						function(err,info){
							Post.findOne({where: {id: postId}},
								function(err, instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						})
				}
			});
	};

	Post.likerCounter = function(postId, cb){
		Post.findOne({fields: {liker: true}, where: {id: postId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['liker'] === ""){
						cb(null,0);
				}else {
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
				}else if(instance['seen'] === ""){
						cb(null,0);
				}else {
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
				}else if(instance['sharer'] === ""){
						cb(null,0);
				}else {
					data = instance['sharer'].split(",");
					cb(null,data.length);
				}
			});
	};
	
	Post.addPost = function(data, cb){
		// console.log(category);
		// date = new Date();
		// dateJSON = date.toJSON();
		Post.create(data,
			function(err, instance){
				if(instance===null){
					cb(null, null);
				}else {
					if(instance['priority']==="true"){
						var sendNotification = function(data) {
						  var headers = {
						    "Content-Type": "application/json",
						    "Authorization": "Basic YzIxZTYwOWEtNmU3Zi00ZTZiLTlhZWEtYjFjYTRhMjA3NzMy"
						  };
						  
						  var options = {
						    host: "onesignal.com",
						    port: 443,
						    path: "/api/v1/notifications",
						    method: "POST",
						    headers: headers
						  };
						  
						  var https = require('https');
						  var req = https.request(options, function(res) {  
						    res.on('data', function(data) {
						      console.log("Response:");
						      console.log(JSON.parse(data));
						      // console.log(JSON.parse(data));
						    });
						  });
						  
						  req.on('error', function(e) {
						    console.log("ERROR:");
						    console.log(e);
						  });
						  
						  req.write(JSON.stringify(data));
						  req.end();
						};

						var message = { 
						  app_id: "0010ee59-1672-4d84-acaf-2256df52939c",
						  contents: {"en": "There is an important post for you. Let's see it!"},
						  included_segments: ["All"],
						  isAndroid: true
						};

						sendNotification(message);
						// console.log(instance);
						cb(null, instance);
					}else{
						cb(null, instance);
					}
					
				}
			})
		
	}

	Post.getMostLikedPost = function(cb){
		Post.find({},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				} else {
					var total = []; 
					for(var i in instance){
						var data = []; 
						if (instance[i]['liker'] != ""){  // if liker is empty 
							data = instance[i]['liker'].split(","); // split liker with comma
							total [i] = data.length;
						} else {
							total [i] = 0;
						}
					}

					// search most liked post
					var max = 0;  
					var result; // index of most liked post
					for (var i in total){
						if(total[i] > max){ // if max less than max, then total replace the value of max
							max = total[i]; 
							result = i; // index of most liked post
						}
					}
					
					cb(null,instance[result]);
				}
			}
		);
	}

	Post.getMostSharedPost = function(cb){
		Post.find({},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				} else {
					var total = []; 
					// console.log(instance);
					for(var i in instance){
						var data = [];
						if(instance[i]['sharer'] != ""){ // if sharer is empty
							data = instance[i]['sharer'].split(",");
							total [i] = data.length;
						} else {
							total [i] = 0;
						}
					}

					var max = 0;
					var result; // index of most shared post
					for (var i in total){
						if(total[i] > max){
							max = total[i];
							result = i;
						}
					}
					
					// console.log(result);
					cb(null,instance[result]);
				}
			}
		);
	}

	Post.getMostCommentedPost = function(cb){
		var PostComment = Post.app.models.Comment;
		PostComment.find({order: 'postId DESC'},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				} else {
					var postIds = []; 
					for(postId in instance){
						postIds.push(instance[postId]['postId']); // collecting all postId of post					
					}

					var count = []; 
					var index = -1;
					var temp = [];
					for (var a in postIds){ 
						if (postIds[a-1] != "undefined"){ // from second element until the last element of postIds
							if (postIds[a] === postIds[a-1]){ 
								count[index]++;
							} else { // find new postId
								index++;
								temp.push(postIds[a]);
								count[index] = 1;
							}
						} else { // the first element
							index++;
							temp.push(postIds[a]);
							count[index] = 1;
						}
					}

					// search the most commented post
					var max = 0;
					for (var i in count){
						if(count[i] > max){
							max = count[i];
							result = i;
						}
					}

					// get all data of post by postId
					Post.findOne({where : {id : postIds[result]}},
						function(err,instance){
							if(instance===null){
								cb(null,null);
							} else {
								cb(null, instance); // return the most commented post
							}
					});
					
					
				}
			}
		);
	}

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
		'addComment',
		{
			accepts: [
					{arg: 'postId', type: 'string'},
					{arg: 'employeeId', type: 'string'},
					{arg: 'employeeName', type: 'string'},
					{arg: 'content', type: 'string'},
					],
			returns: {arg: 'postId', type: 'string', root: true},
			http: {path: '/addComment', verb: 'put'}
		})

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

	Post.remoteMethod(
		'addPost',
		{
			accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
			returns: {type: 'string', root: true},
			http: {path: '/addPost', verb: 'post', source: 'query'},
			description: "Adding a post"
		}
	);

	Post.remoteMethod(
		'getMostLikedPost',
		{
			returns: {type: 'string', root: true},
			http: {path: '/getMostLikedPost', verb: 'post', source: 'query'},
			description: "Get most liked post"
		}
	);

	Post.remoteMethod(
		'getMostSharedPost',
		{
			returns: {type: 'string', root: true},
			http: {path: '/getMostSharedPost', verb: 'post', source: 'query'}
		}
	);

	Post.remoteMethod(
		'getMostCommentedPost',
		{
			returns: {type: 'string', root: true},
			http: {path: '/getMostCommentedPost', verb: 'post', source: 'query'}
		}
	);

};
