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

	Employee.getLeaderboard = function(cb){
		Employee.find({fields: {id: true, username: true, poin: true, badges: true, badgeCount: true}, order: 'poin DESC'},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
	}

	Employee.addLike = function(employeeId, postId, cb){
		Employee.findOne({where:{id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					dataPostLiked = instance['postLiked']; //get every posts he has liked
					postLikedNow = dataPostLiked.toString();
					dataPoin = instance['poin']; //get every poin he got
					dataPoin = dataPoin+3;
					dataBadges = instance['badges']; //get every badges he achieved
					badgeCount = instance['badgeCount']
					// if postId has been liked
					if(postLikedNow.includes(postId)){
						cb("Post id has been registered, you cannot like a post twice");
					}
					//if this is the first post he like
					else if(postLikedNow === ''){
						postLikedNow = postId;
						Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin}, //update postLikedNow, and poin +3
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
						splitPostLiked = postLikedNow.split(','); //split postLikedNow to array to make it easier to be counted
						counterLike = splitPostLiked.length;
						console.log(counterLike);
						//if posts he liked has been 10, he got bronze
						if(counterLike==10){
							date = new Date();
							dateJSON = date.toJSON();
							//if this is the first badge he got
							if(dataBadges.toString()==="[{}]"){
								newBadge = '{"badgeName": "The Twin Thumbs Up [BRONZE]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
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
							}else{ //last badge to achieve
								newBadge = '{"badgeName": "The Twin Thumbs Up [BRONZE]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge));
								badgesNow = dataBadges.toString();
								Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
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
							
						}else if(counterLike==30){ //if posts he liked has been 30, he get silver
							date = new Date();
							dateJSON = date.toJSON();
							//since it's impossible to get silver badge without bronze first, we didn't include the first badge he got
							 //last badge to achieve
							newBadge = '{"badgeName": "The Twin Thumbs Up [SILVER]", "achieved_date": "'+dateJSON+'"}';
							badgeCount = badgeCount+1;	
							dataBadges.push(JSON.parse(newBadge));
							badgesNow = dataBadges.toString();
							Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
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
						}else if(counterLike==50){ //if posts he liked has been 50, he get gold
							date = new Date();
							dateJSON = date.toJSON();
							//since it's impossible to get bold badge without bronze or silver first, we didn't include the first badge he got
							 //last badge to achieve
							newBadge = '{"badgeName": "The Twin Thumbs Up [GOLD]", "achieved_date": "'+dateJSON+'"}';
							badgeCount = badgeCount+1;
							dataBadges.push(JSON.parse(newBadge));
							badgesNow = dataBadges.toString();
							Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
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

						else{ //posts he liked is not 10, 30, or 50
							Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin}, //update postLikedNow, and poin +3
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
				}				
			});
	};

	Employee.addUnlike = function(employeeId, postId, cb){
		Employee.findOne({where:{id: employeeId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					dataPostLiked = instance['postLiked']; //get every posts he has liked
					postLikedNow = dataPostLiked.toString(); //store all post he has liked now to string
					dataPoin = instance['poin'];
					dataPoin = dataPoin-3;
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
					Employee.updateAll({id: employeeId}, {postLiked: postLikedNow, poin: dataPoin}, //update
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
					dataPostseen = instance['postSeen']; //get every posts he has seen
					postSeenNow = dataPostseen.toString();
					dataPoin = instance['poin']; //get every poin he got
					dataPoin = dataPoin+1;
					dataBadges = instance['badges']; //get every badges he achieved
					badgeCount = instance['badgeCount'];
					//if postId has been seen
					if(postSeenNow.includes(postId)){
						cb(null,instance);
					}
					//if this is the first post he see
					else if(postSeenNow === ''){
						postSeenNow = postId;
						Employee.updateAll({id: employeeId}, {postSeen: postSeenNow, poin: dataPoin}, //update
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
						splitPostSeen = postSeenNow.split(','); //split
						counterSeen = splitPostSeen.length;
						if(counterSeen==10){
							date = new Date();
							dateJSON = date.toJSON();
							// if this is the first badge
							if (dataBadges.toString()==="[{}]"){
								newBadge = '{"badgeName" : "The Most Seeing Eye [BRONZE]", "achieved_date" : "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								Employee.updateAll({id:employeeId}, {postSeen: postSeenNow, poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
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
							} else {
								newBadge = '{"badgeName": "The Most Seeing Eye [BRONZE]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge));
								badgesNow = dataBadges.toString();
								Employee.updateAll({id:employeeId}, {postSeen: postSeenNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, newBadge
								function(err,info){
									Employee.findOne({where:{id: employeeId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
							}
						}
						else if (counterSeen==30){
								date = new Date();
								dateJSON = date.toJSON();
								newBadge = '{"badgeName": "The Most Seeing Eye [SILVER]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge)); // add new badge
								badgesNow = dataBadges.toString();
								Employee.updateAll({id:employeeId}, {postSeen:postSeenNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
								function(err,info){
									Employee.findOne({where:{id: employeeId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						} else if (counterSeen==50){
								date = new Date();
								dateJSON = date.toJSON();
								newBadge = '{"badgeName": "The Most Seeing Eye[GOLD]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge)); // add new badge
								badgesNow = dataBadges.toString();
								Employee.updateAll({id:employeeId}, {postSeen:postSeenNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
								function(err,info){
									Employee.findOne({where:{id: employeeId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						} else {
							Employee.updateAll({id:employeeId}, {postSeen:postSeenNow, poin: dataPoin}, // update postSeenNow, poin+1
								function(err,info){
									Employee.findOne({where:{id: employeeId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						}
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
					dataPoin = instance['poin']; //get every poin he got
					dataPoin = dataPoin+7;
					dataBadges = instance['badges']; //get every badges he achieved
					badgeCount = instance['badgeCount'];
					//if postId has been shared
					if(postSharedNow.includes(postId)){
						cb(null,instance);
					}
					//if this is the first post he share
					else if(postSharedNow === ''){
						postSharedNow = postId;
						Employee.updateAll({id: employeeId}, {postShared: postSharedNow, poin:dataPoin}, //update
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
						splitPostShared = postSharedNow.split(','); //split
						counterShared = splitPostShared.length;
						if(counterShared==10){
							date = new Date();
							dateJSON = date.toJSON();
								if (dataBadges.toString()==="[{}]"){
									newBadge = '{"badgeName" : "The Human Handbook [BRONZE]", "achieved_date" : "'+dateJSON+'"}';
									badgeCount = badgeCount+1;
									Employee.updateAll({id:employeeId}, {postShared: postSharedNow, poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, // update postSharedNow, poin+1, new Badge
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
								} else {
									newBadge = '{"badgeName": "The Human Handbook [BRONZE]", "achieved_date": "'+dateJSON+'"}';
									badgeCount = badgeCount+1;
									dataBadges.push(JSON.parse(newBadge));
									badgesNow = dataBadges.toString();
									Employee.updateAll({id:employeeId}, {postShared: postSharedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSharedNow, poin+1, newBadge
									function(err,info){
										Employee.findOne({where:{id: employeeId}}, 
											function(err,instance){
												if(instance===null){
													cb(null,null);
												} else {
													cb(null, instance);
												}
											})
									});
								}
						}
						else if (counterShared==30){
								date = new Date();
								dateJSON = date.toJSON();
								newBadge = '{"badgeName": "The Human Handbook [SILVER]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge)); // add new badge
								badgesNow = dataBadges.toString();
								Employee.updateAll({id:employeeId}, {postShared:postSharedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new adge
								function(err,info){
									Employee.findOne({where:{id: employeeId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						} else if (counterShared==50){
							date = new Date();
							dateJSON = date.toJSON();
							newBadge = '{"badgeName": "The Human Handbook[GOLD]", "achieved_date": "'+dateJSON+'"}';
							badgeCount = badgeCount+1;
							dataBadges.push(JSON.parse(newBadge)); // add new badge
							badgesNow = dataBadges.toString();
							Employee.updateAll({id:employeeId}, {postShared:postSharedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
							function(err,info){
								Employee.findOne({where:{id: employeeId}}, 
									function(err,instance){
										if(instance===null){
											cb(null,null);
										} else {
											cb(null, instance);
										}
									})
							});
						} else {
							Employee.updateAll({id:employeeId}, {postShared:postSharedNow, poin: dataPoin}, // update postSeenNow, poin+1
								function(err,info){
									Employee.findOne({where:{id: employeeId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						}
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
		'getLeaderboard',
		{
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getLeaderboard', verb: 'get', source: 'query'},
			description: "Get leaderboard of all employees"
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
