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
                files: ['example/src/**/*.js'],
                tasks: ['jshint:example', 'browserify:example']
            },

            test: {
                files: ['test/unit/**/*.js', 'test/main.js'],
                tasks: ['jshint:test', 'browserify:test']
            },

            options: {
                livereload: 35729
            }
        },

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    // build it all by default
    grunt.registerTask('build', ['jshint', 'browserify']);
    grunt.registerTask('default', ['build']);
};
