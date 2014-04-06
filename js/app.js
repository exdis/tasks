define('app',["angular","angular-route","controller"], function(angular) {
	var app = angular.module('exdisme',['ngRoute']);

	app.factory('Posts', function() {
		var Posts = [
			{
				title: "First Post",
				content: "First content",
				pubDate: "05.04.2014"
			},
			{
				title: "Second Post",
				content: "Second content",
				pubDate: "06.04.2014"
			}
		];
		return Posts;
	});

	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/', {
				templateUrl: 'templates/index.html',
				controller: 'ctrl'
			}).
			otherwise({
				redirectTo: '/'
			});
		}
	]);

	return app;

});