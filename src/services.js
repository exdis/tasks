define(['angular', 'angular-resource'], function (angular) {
	'use strict';
	
	/* Services */

	var services = angular.module('app.services', ['ngResource']);
	services.factory('Posts', function($resource) {
		var res = $resource('api/posts/:id',{},{
			get: {method: 'GET', isArray:true},
			getOne: {method: 'GET', isArray:false, params: {id: 0}}
		});
		return {
			get : function() {return res.get();},
			getOne : function(id) {return res.getOne({id:id});}
		};
	});

	return services;

});
