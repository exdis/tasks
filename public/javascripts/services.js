define(['angular', 'angular-resource'], function (angular) {
	'use strict';
	
	/* Services */

	var services = angular.module('app.services', ['ngResource']);
	services.factory('Posts', function($resource) {
		return $resource('api/posts',{},{
			get: {method: 'GET', isArray:true}
		});
	});

	return services;

});
