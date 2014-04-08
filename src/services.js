define(['angular'], function (angular) {
	'use strict';
	
	/* Services */

	return angular.module('app.services', ['ngResource'])
		.factory('Posts', function($resource) {
			return $resource('api/posts',{},{
				get: {method: 'GET', isArray:true}
			});
		});

});
