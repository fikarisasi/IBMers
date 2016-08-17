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
			accepts: {arg: 'receiver', type: 'string'},
			returns: {
				arg: 'id', type: 'string', root: true
				// {arg: 'category', type: 'string'},
				// {arg: 'comment', type: 'string'},
				// {arg: 'content', type: 'string'},
				// {arg: 'date', type: 'date'},
				// {arg: 'like', type: 'string'},
				// {arg: 'photo', type: 'string'},
				// {arg: 'priority', type: 'string'},
				// {arg: 'privacy', type: 'string'},
				// {arg: 'seen', type: 'string'},
				// {arg: 'title', type: 'string'},
				// {arg: 'writer', type: 'string'},
				// {arg: 'employee', type: 'string'}
			},
			http: {path: '/getPostByRole', verb: 'get', souce: 'query'},
			description: "Get all posts by user role"
		}
	);
};
