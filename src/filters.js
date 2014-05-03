define(['angular', 'services','moment'], function (angular, services, moment) {
	'use strict';

	/* Filters */
  
	angular.module('app.filters', ['app.services'])
		.filter('parseTime', function() {
			return function(input) {
				var d = moment.duration(parseInt(input));
				console.log(moment.duration(input, 'seconds'));
				var out = d.get('hours') + 'h ' + d.get('minutes') + 'm ' + d.get('seconds') + 's';
				return out;
			};
	});
});
