define(['angular', 'services'], function (angular, services) {
	'use strict';

	/* Controllers */
	
	var ctrl = angular.module('app.controllers', ['app.services']);
	ctrl.controller('ctrl', ['$scope', 'Posts', function ($scope, Posts) {
		$scope.posts = Posts.get();
	}]);
	ctrl.controller('admin', ['$scope', function ($scope) {
		$scope.message = "Welcome!";
	}]);
});