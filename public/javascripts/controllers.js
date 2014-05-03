define(['angular', 'services', 'jquery'], function (angular, services, $) {
	'use strict';

	/* Controllers */
	
	var ctrl = angular.module('app.controllers', ['app.services']);
	ctrl.controller('ctrl', ['$scope', 'Tasks', '$http', '$route', function ($scope, Tasks, $http, $route) {
		if(typeof $scope.currentUser !== 'undefined') {
			$scope.tasks = Tasks.get($scope.currentUser);
		}
		$scope.submit = function() {
			$scope.form.userid = $scope.currentUser;
			$http.post('api/tasks', JSON.stringify($scope.form)).success(function(data) {
				if(data.status === 'OK') {
					$('#new').modal('hide');
					if($('.navbar-collapse').hasClass('in')) {
						$('.navbar-toggle').click();
					}
					$route.reload();
				}
			});
		};
		$scope.taskDelete = function(id) {
			$http.delete('api/tasks/' + id);
			if($('.navbar-collapse').hasClass('in')) {
				$('.navbar-toggle').click();
			}
			$route.reload();
		};
	}]);
});