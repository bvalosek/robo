module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            lib: ['lib/**/*.js'],
            test: ['test/main.js', 'test/unit/*.js'],
            example: ['example/src/**/*.js'],
            grunt: ['Gruntfile.js']
        },

        browserify: {
            test: {
                src: ['test/main.js'],
                dest: 'test/bin/main.debug.js',
                options: { debug: true }
            },
            example: {
                src: ['example/src/main.js'],
                dest: 'example/bin/ExampleApp.debug.js',
                options: { debug: true }
            }
        },

        watch: {

            // If the lib changes, rebuild errthing
            lib: {
                files: ['lib/**/*.js'],
                tasks: ['build']
            },

            // Example app
            example: {
                files: ['example/src/**/*.{js,html,xml,css,less}', '!example/src/res/resource.js'],
                tasks: ['jshint:example', 'resify:example', 'browserify:example']
            },

            test: {
                files: ['test/unit/**/*.js', 'test/main.js'],
                tasks: ['jshint:test', 'browserify:test']
            },

            options: {
                livereload: 35729
            }
        },

        resify: {
            example: {
                src: ['example/src/res/**/*.*', '!example/res/resource.js'],
                dest: 'example/src/res/resource.js'
            }
        }

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-resify');

    // build it all by default
    grunt.registerTask('build', ['jshint', 'resify', 'browserify']);
    grunt.registerTask('default', ['build']);
};
