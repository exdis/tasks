requirejs.config({
	baseUrl: "javascripts/lib",
    paths: {
      "app": "../app",
      "jquery": "jquery/dist/jquery.min",
      "angular": "angular/angular",
      "angular-route": "angular-route/angular-route",
      "controller": "../app/controllers/controller"
    },
    "shim": {
        "angular": {
        	exports: 'angular'
        },
        "angular-route": {
        	deps: ['angular']
        }
    }
});

requirejs(['app']);