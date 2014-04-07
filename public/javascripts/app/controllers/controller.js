define('controllers', ["app"], function(app) {
	return app.controller('ctrl',function($scope, Posts) {
		$scope.posts = Posts;
	});
});