define(['angular', 'services'], function (angular, services) {
	'use strict';

	/* Controllers */
	
	var ctrl = angular.module('app.controllers', ['app.services']);
	ctrl.controller('ctrl', ['$scope', 'Posts', function ($scope, Posts) {
		$scope.posts = Posts.get();
	}]);
	ctrl.controller('view', ['$scope', 'Posts', '$routeParams', function ($scope, Posts, $routeParams) {
		$scope.data = Posts.getOne($routeParams.id);
	}]);
	ctrl.controller('admin', ['$scope', '$location', '$http', function ($scope, $location, $http) {
		$scope.message = "Welcome!";
		$scope.submit = function() {
			$http.post('api/posts', JSON.stringify($scope.form)).success(function(data) {
				$location.path('/view/' + data.post._id);
			});
		};
	}]);
});