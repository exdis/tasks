require(["app"], function(app) {
	return app.controller('ctrl',function($scope) {
		$scope.data = { message : "Hello!" }
	});
});