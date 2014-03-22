module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'), 

		jshint : {
			options : {
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				eqnull : true,
				browser : true,
				globals : {
					jQuery : true,
					$ : true,
					console : true
				}
			},
			"<%= pkg.name %>" : {
				src : [ 'src/js/**/*.js' ]
			}
		},

		concat : {
			dist : {
				src : ['src/js/*'],
				dest : 'dest/build.js'
			}
		},

		uglify : {
			options : {
				stripBanners : true,
				banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src : 'dest/build.clean.js',
				dest : 'dest/build.min.js'
			}
		},

		cssmin : {
			with_banner : {
				options : {
					banner : '/* Some banner text */',
				},
				files : {
					'dest/style.min.css' : ['src/css/*']
				}
			}
		},

		watch : {
			scripts : {
				files : ['src/js/*.js'],
				tasks : ['jshint', 'concat', 'removelogging', 'uglify']	
			},
			css : {
				files : ['src/css/*.css'],
				tasks : ['cssmin']
			}
		},

		removelogging : {
			dist : {
				src: 'dest/build.js',
				dest : 'dest/build.clean.js'
			}
		},

		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5, // maximum number of notifications from jshint output
				title: "<%= pkg.name %>" // defaults to the name in package.json, or will use project directory's name
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-notify');

	// This is required if you use any options.
	grunt.task.run('notify_hooks');

	grunt.registerTask('default',['jshint','concat','removelogging','uglify','cssmin','watch']);
	grunt.registerTask('test', ['']);
};