requirejs.config({
	baseUrl: "js/lib",
    paths: {
      "app": "../app",
      "jquery": "jquery-2.1.0.min"
    },
    //"shim": {
        //"jquery.alpha": ["jquery"],
        //"jquery.beta": ["jquery"]
    //}
});

requirejs(['app']);