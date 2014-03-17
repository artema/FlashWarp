module.exports = function(grunt) {
    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);  

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                'Gruntfile.js',
                'js/**/*.js',
                'tests/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            build: {
                src: 'js/flashwarp.js',
                dest: 'dist/flashwarp.min.js'
            }
        },
        jsdoc: {
            js : {
                src: ['js/*.js'], 
                options: {
                    destination: 'docs/js'
                }
            }
        },
        asdoc:{
            options: {
                output: 'docs/flash/'
            },
            lib: {
                options: {
                    rawConfig: '-source-path flash/src/'
                },
                src: ['flash/src/**/*.as']
            }
        },
        compc: {
            lib: {
                options: {
                    'source-path': ['flash/src'] 
                },
                src: ['flash/src/**/*.as'],
                dest: 'dist/FlashWarp.swc'
            }
        },
        mxmlc: {
            options: {
                rawConfig: '-library-path+=dist'
            },
            example: {
                files: {
                    'example/app/bin/App.swf': ['example/app/src/App.mxml']
                }
            },
            test: {
                files: {
                    'tests/app/bin/App.swf': ['tests/app/src/App.mxml']
                }
            }
        },
        watch: {
            js: {
                files: ['js/flashwarp.js'],
                tasks: ['jshint', 'uglify']
            }
        }
    });

    grunt.event.on('qunit.testStart', function (name) {
        grunt.log.ok("Running test: " + name);
    });
    
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test', 'jsdoc', 'uglify', 'compc', 'asdoc', 'mxmlc']);
};