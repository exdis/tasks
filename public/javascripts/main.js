requirejs.config({
	baseUrl: "javascripts/lib",
    paths: {
      "app": "../app",
      "jquery": "jquery/dist/jquery.min",
      "angular": "angular/angular",
      "angular-route": "angular-route/angular-route",
      "angular-resource": "angular-resource/angular-resource",
      "controllers": "../controllers",
      "routes": "../routes",
      "directives": "../directives",
      "filters": "../filters",
      "services": "../services",
      "moment": "moment/moment"
    },
    "shim": {
        "angular": {
        	exports: 'angular'
        },
        "angular-route": {
        	deps: ['angular']
        },
        "angular-resource" : {
          deps: ['angular']
        }
    },
    priority: [
      "angular","angular-resource","angular-route"
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