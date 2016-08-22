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
		if(role === "div_jti"){
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
		}
		
	};

	Post.pagination = function(page, cb){
		pagesize = page*10-10;
		console.log(pagesize); 
		Post.find({limit: 10, skip: pagesize},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			})
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
			accepts: {arg: 'page', type: 'number'},
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/pagination', verb: 'get', source: 'query'},
			description: "Get all posts by pagination"
		})
};
