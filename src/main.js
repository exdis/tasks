requirejs.config({
	baseUrl: "javascripts/lib",
    paths: {
      "app": "../app",
      "jquery": "jquery/dist/jquery.min",
      "angular": "angular/angular",
      "angular-route": "angular-route/angular-route",
      "controllers": "../controllers",
      "routes": "../routes",
      "directives": "../directives",
      "filters": "../filters",
      "services": "../services",
    },
    "shim": {
        "angular": {
        	exports: 'angular'
        },
        "angular-route": {
        	deps: ['angular']
        }
    },
    priority: [
      "angular"
    ]
});

window.name = "NG_DEFER_BOOTSTRAP!";

require( ['angular','app','routes' ], function(angular, app, routes) {
  'use strict';
  var $html = angular.element(document.getElementsByTagName('html')[0]);

  angular.element().ready(function() {
    angular.resumeBootstrap([app['name']]);
  });
});