define(['angular', 'app'], function(angular, app) {
  'use strict';

  return app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {
      templateUrl: 'templates/index.html',
      controller: 'ctrl'
    });
    $routeProvider.otherwise({redirectTo: '/'});
  });

});
