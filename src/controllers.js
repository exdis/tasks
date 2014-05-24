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
					$scope.loading = false;
				});
			}
		};
		$scope.total = function(rubles) {
			var total = 0;
			angular.forEach($scope.tasks, function(v,k) {
				total += parseInt(v.time);
			});
			var d = moment.duration(total);
			var out;
			if(!rubles) {
				out = Math.floor(d.asHours()) + 'hours ' + d.get('minutes') + 'minutes ' + d.get('seconds') + 'seconds';
			} else {
				out = d.asHours() * $scope.settings.cost;
			}
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
					$scope.init($scope.pagination.cur);
					$scope.form = {};
				}
			});
		};
		$scope.submitSettings = function() {
			var settings = $scope.settings;
			$http.put('api/users/' + $scope.currentUser, JSON.stringify(settings)).success(function(data) {
				if(data.status === 'OK') {
					$('#settings').modal('hide');
					if($('.navbar-collapse').hasClass('in')) {
						$('.navbar-toggle').click();
					}
				}
			});
		};
		$scope.taskDelete = function() {
			console.log($scope.tasktoremove);
			var id = (typeof $scope.tasktoremove !== 'undefined') ? $scope.tasktoremove : '';
			$http.delete('api/tasks/' + id);
			var index = $scope.tasks.indexOf(id);
  			$scope.tasks.splice(index,1); 
  			$('#confirm').modal('hide');
			if($('.navbar-collapse').hasClass('in')) {
				$('.navbar-toggle').click();
			}
			$scope.init($scope.pagination.cur);
		};
	}]);
});