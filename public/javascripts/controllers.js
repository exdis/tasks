define(['angular', 'services', 'jquery', 'moment'], function (angular, services, $, moment) {
	'use strict';

	/* Controllers */
	
	var ctrl = angular.module('app.controllers', ['app.services']);
	ctrl.controller('ctrl', ['$scope', 'Tasks', '$http', '$route', function ($scope, Tasks, $http, $route) {
		if(typeof $scope.currentUser !== 'undefined') {
			$scope.tasks = Tasks.get($scope.currentUser);
		}
		$scope.submit = function() {
			var form = $scope.form;
			var h = form.time.match(/\d+h/);
			var m = form.time.match(/\d+m/);
			var s = form.time.match(/\d+s/);
			console.log(h);
			var duration = moment.duration({
				hours: h ? parseInt(h[0].replace('h','')) : 0,
				minutes: m ? parseInt(m[0].replace('m','')) : 0,
				seconds: s ? parseInt(s[0].replace('s','')) : 0
			});
			form.time = duration.asMilliseconds();
			form.userid = $scope.currentUser;
			$http.post('api/tasks', JSON.stringify(form)).success(function(data) {
				if(data.status === 'OK') {
					$('#new').modal('hide');
					if($('.navbar-collapse').hasClass('in')) {
						$('.navbar-toggle').click();
					}
					$route.reload();
					$scope.form = {};
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