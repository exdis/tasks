require(["app"], function(app) {
	return app.controller('ctrl',function($scope, Posts) {
		$scope.posts = Posts;
	});
});