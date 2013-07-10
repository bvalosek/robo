module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            lib: ['lib/**/*.js'],
            test: ['test/main.js', 'test/unit/*.js'],
            grunt: ['Gruntfile.js']
        },

        browserify: {
            test: {
                src: ['test/main.js'],
                dest: 'test/bin/main.debug.js',
                options: { debug: true }
            }
        },

        watch: {
            all: {
                files: [
                    'lib/**/*.js',
                    'test/main.js',
                    'test/unit/**/*.js'
                ],
                tasks: ['default'],
                options: {
                    livereload: 35729
                }
            }
        },

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    // tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('build', ['lint', 'browserify']);
    grunt.registerTask('default', ['build']);
};
