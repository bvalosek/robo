module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'lib/**/*.js',
                'test/unit/**/*.js',
                'test/main.js'
            ],
        },

        browserify: {
            test: {
                src: ['test/main.js'],
                dest: 'test/bin/main.debug.js',
                options: { debug: true }
            }
        },

        watch: {
            files: [
                'Gruntfile.js',
                'lib/**/*.js',
                'test/index.html',
                'test/unit/**/*.js',
                'test/unit/main.js',
                'node_modules/compose/compose.js'
            ],
            tasks: ['build']
        }

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('build', ['lint', 'browserify']);
    grunt.registerTask('default', ['build']);

};
