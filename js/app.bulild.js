define("app",["angular","angular-route","controller"],function(e){var t=e.module("exdisme",["ngRoute"]);return t.factory("Posts",function(){var e=[{title:"First Post",content:"First content",pubDate:"05.04.2014"},{title:"Second Post",content:"Second content",pubDate:"06.04.2014"}];return e}),t.config(["$routeProvider",function(e){e.when("/",{templateUrl:"templates/index.html",controller:"ctrl"}).otherwise({redirectTo:"/"})}]),t}),define("js/app",function(){});