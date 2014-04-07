define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'templates/index.html',
			controller: 'ctrl'
		});
		$routeProvider.otherwise({redirectTo: '/'});
	}]);

});