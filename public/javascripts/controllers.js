define(['angular', 'services', 'jquery', 'moment'], function (angular, services, $, moment) {
	'use strict';

	/* Controllers */
	
	var ctrl = angular.module('app.controllers', ['app.services']);
	ctrl.controller('ctrl', ['$scope', 'Tasks', '$http', '$route', function ($scope, Tasks, $http, $route) {
		$scope.init = function(page) {
			if(typeof $scope.currentUser !== 'undefined') {
				Tasks.get({id:$scope.currentUser,page:page}, function(data) {
					$scope.count = data.count;
					$scope.tasks = data.tasks;
					$scope.pageTotal = Math.ceil(parseInt($scope.count) / 20);
					$scope.pagination = {
						cur: page,
						total: $scope.pageTotal,
						display: 10
					};
				});
			}
		};
		$scope.total = function() {
			var total = 0;
			angular.forEach($scope.tasks, function(v,k) {
				total += parseInt(v.time);
			});
			var d = moment.duration(total);
			var out = d.get('hours') + 'hours ' + d.get('minutes') + 'minutes ' + d.get('seconds') + 'seconds';
			return out;
		};
		$scope.submit = function() {
			var form = $scope.form;
			var h = form.time.match(/\d+h/);
			var m = form.time.match(/\d+m/);
			var s = form.time.match(/\d+s/);
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