requirejs.config({
	baseUrl: "js/lib",
    paths: {
      "app": "../app",
      "jquery": "jquery/dist/jquery.min"
    },
    //"shim": {
        //"jquery.alpha": ["jquery"],
        //"jquery.beta": ["jquery"]
    //}
});

requirejs(['app']);