requirejs.config({
	baseUrl: "js/lib",
    paths: {
      "app": "../app",
      "jquery": "jquery/dist/jquery.min",
      "angular": "angular/angular",
      "controller": "../app/controllers/controller"
    },
    "shim": {
        "angular": {
        	exports: 'angular'
        }
    }
});

requirejs(['app']);