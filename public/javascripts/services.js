define(['angular'], function (angular) {
	'use strict';
	
	/* Services */

	return angular.module('app.services', [])
		.service('Posts', function() {
			this.get = function() {
				return [
					{
						title: "First Post",
						content: "First content",
						pubDate: "05.04.2014"
					},
					{
						title: "Second Post",
						content: "Second content",
						pubDate: "06.04.2014"
					}
				]
			}
		});

});
