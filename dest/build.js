(function() {
	var tree = 'oak';
	var funcOne = function() {
		var one = 1;
		var somevar = 'foo';
	};
	console.log( tree );
})();
(function() {
	var funcTwo = function() {
		var two = 2;
		var somevar = 'bar';
		var three = 2 + two;
	};

	console.log( 'two' );
})();