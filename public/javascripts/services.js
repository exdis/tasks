define(['angular', 'angular-resource'], function (angular) {
	'use strict';
	
	/* Services */

	var services = angular.module('app.services', ['ngResource']);
	services.factory('Tasks', function($resource) {
		var res = $resource('api/tasks/:id',{},{
			get: {method: 'GET', isArray:true, params: {id: 0}},
		});
		return {
			get : function(id) {return res.get({id:id});},
		};
	});

	return services;

});
