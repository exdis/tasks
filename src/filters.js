define(['angular', 'services','moment'], function (angular, services, moment) {
	'use strict';

	/* Filters */
  
	angular.module('app.filters', ['app.services'])
		.filter('parseDate', function() {
			return function(date) {
				var d = new Date(date);
				return moment(d).format("DD.MM.YYYY");
			}
	});
});
