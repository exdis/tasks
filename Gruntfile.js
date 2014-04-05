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
					define : false,
					angular : false,
					jQuery : true,
					$ : true,
					console : true
				}
			},
			"<%= pkg.name %>" : {
				src : [ 'src/js/**/*.js' ]
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl : "./",
					mainConfigFile : "js/main.js",
					out : "js/app.bulild.js",
					name : "js/app"
				}
			}
		},

		concat : {
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
				files : [{
					expand : true,
					src : '**/*.js',
					dest : 'js',
					cwd : 'src/',
					ext : '.min.js'
				}]
			}
		},

		copy : {
			scripts : {
				files : [{
					expand : true,
					cwd : 'src/',
					src : ['**'],
					dest : 'js/'
				}]
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
				files : ['src/**/*.js'],
				tasks : ['jshint', 'uglify', 'copy', 'requirejs'],
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
				src: 'js/app.dirty.js',
				dest : 'js/app.js'
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
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// This is required if you use any options.
	grunt.task.run('notify_hooks');

	grunt.registerTask('default',['jshint','concat', 'copy', 'uglify','requirejs','compass','cssmin','watch']);
	grunt.registerTask('test', ['']);
};