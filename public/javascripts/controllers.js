define(['angular', 'services'], function (angular, services) {
	'use strict';

	/* Controllers */
	
	return angular.module('app.controllers', ['app.services'])
		.controller('ctrl', ['$scope', 'Posts', function ($scope, Posts) {
			$scope.posts = Posts.get();
		}]);
});