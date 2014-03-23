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
			scripts : {
				src : ['lib/*','src/js/*'],
				dest : 'js/script.js'
			},
			css : {
				src : ['stylesheets/*','src/css/*'],
				dest : 'css/style.css'	
			}
		},

		uglify : {
			options : {
				stripBanners : true,
				banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src : 'js/script.clean.js',
				dest : 'js/script.min.js'
			}
		},

		cssmin : {
			with_banner : {
				options : {
					banner : '/* Styles for <%= pkg.name %> */',
				},
				files : {
					'css/style.min.css' : ['src/css/*','stylesheets/*']
				}
			}
		},

		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},

		watch : {
			scripts : {
				files : ['src/js/*.js'],
				tasks : ['jshint', 'concat', 'removelogging', 'uglify'],
				options: {
					livereload: true,
				}
			},
			sass : {
				files : ['sass/*'],
				tasks : ['compass','concat','cssmin'],
				options: {
					livereload: true,
				}
			},
			css : {
				files : ['src/css/*.css'],
				tasks : ['concat','cssmin'],
				options: {
					livereload: true,
				}
			},
			html : {
				files : ['**/*.html'],
				options: {
					livereload: true,
				}
			}
		},

		removelogging : {
			dist : {
				src: 'js/script.js',
				dest : 'js/script.clean.js'
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
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-notify');

	// This is required if you use any options.
	grunt.task.run('notify_hooks');

	grunt.registerTask('default',['jshint','concat','removelogging','uglify','compass','cssmin','watch']);
	grunt.registerTask('test', ['']);
};