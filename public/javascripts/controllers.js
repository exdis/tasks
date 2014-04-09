define(['angular', 'services'], function (angular, services) {
	'use strict';

	/* Controllers */
	
	var ctrl = angular.module('app.controllers', ['app.services']);
	ctrl.controller('ctrl', ['$scope', 'Posts', function ($scope, Posts) {
		$scope.posts = Posts.get();
	}]);
	ctrl.controller('admin', ['$scope', '$location', '$http', function ($scope, $location, $http) {
		$scope.message = "Welcome!";
		$scope.submit = function() {
			console.log($scope.form);
			$http.post('api/posts', JSON.stringify($scope.form)).success(function() {
				$location.path('/admin');
			});
		};
	}]);
});