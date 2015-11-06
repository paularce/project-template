module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs:{
            css: "dist/css"
        },
        // Task configuration.
        clean: {
            dist: ['dist']
        },

        copy : {
            html : {
                cwd: 'src/',
                src : ['*.html', 'fonts/**/*', 'img/**/*', 'data/**/*'],
                dest : 'dist/',
                expand: true
            },
            libs:{
                cwd: 'src/',
                src: ['js/client/libs/*.js'],
                dest: 'dist/',
                expand: true
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: '<%= dirs.scss %>',
                    environment: 'production',
                    noLineComments: true
                }
            },
			dev: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'dist/css'
                }
            }
        },
        
        jshint: {
            scripts: {
                src : [ 'src/js/**/*.js', '!src/js/client/libs/**/*.js'],
                options: {
                    laxbreak : true,
				    smarttabs : true,
                    browserify: true,
                    browser: true,
                    devel: true,
                    strict: true,
                    globals: {
                        google: false
                    }
                }
            }
        },

		browserify: {
            web: {
                dest: 'dist/js/client/app.js',
                src: ['src/js/client/main.js'],
                options: {
                    watch: true
                }
            }
        },
        
        watch: {
            options: {
                spawn:false
            },
            sass: {
                files: ['src/sass/**/*.scss', 'src/css/**/*.css'],
                tasks: ['compass:dev', 'postcss:dist', 'bsReload:css']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint', 'browserify']
            },
            html: {
                files: 'src/**/*.html',
                tasks: ['copy:html', 'bsReload:all']
            }
        },

        uglify: {
            prod: {
                files: {
                    'dist/js/client/app.min.js': ['dist/js/client/app.js']
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8010,
                    base: 'dist'
                }
            }
        },
        
        postcss: {
            options: {
              map: true, // inline sourcemaps

              // or
              map: {
                  inline: false, // save all sourcemaps as separate files...
                  annotation: 'dist/css/maps/' // ...to the specified directory
              },

              processors: [
                require('autoprefixer')({browsers: '> 5%, last 2 versions' }), // add vendor prefixes
                require('cssnano')() // minify the result
              ]
            },
            dist: {
              src: 'dist/css/*.css'
            }
        },
        
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                    './css/*.css',
                    './src/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    background: true,
                    server: {
                        proxy: '127.0.0.1:8010', //our PHP server
                        port: 8080, // our new port
                        baseDir: "dist"
                    }
                }
            }
        },

        bsReload: {
            css: {
                reload: "dist/*.css"
            },
            all: {
                reload: true
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('build-prod', ['clean', 'copy', 'compass:dist', 'postcss:dist', 'browserify', 'uglify:prod']);
    grunt.registerTask('build-dev', ['clean', 'copy', 'compass:dev', 'postcss:dist', 'browserify']);
    
    grunt.registerTask('default',['build-prod']);
    grunt.registerTask('dev', ['build-dev', 'jshint', 'connect:server', 'browserSync', 'watch']);

}
