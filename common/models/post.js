module.exports = function(Post) {
	Post.getPostByRole = function(role,cb){
		Post.find({where: {receiver: {like: role}}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
	};

	Post.remoteMethod(
		'getPostByRole',
		{
			accepts: {arg: 'role', type: 'string'},
			returns: {
				arg: 'id', type: 'string', root: true
			},
			http: {path: '/getPostByRole', verb: 'get', source: 'query'},
			description: "Get all posts by user role"
		}
	);
};
