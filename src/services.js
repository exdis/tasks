define(['angular', 'angular-resource'], function (angular) {
	'use strict';
	
	/* Services */

	var services = angular.module('app.services', ['ngResource']);
	services.factory('Tasks', function($resource) {
		var res = $resource('api/tasks/:id/:page',{},{
				get: {method: 'GET', isArray:false, params: {id: 0,page: 0}},
			});
		return res;
	});

	return services;

});
