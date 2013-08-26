module.exports = (grunt) ->
    'use strict'

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        # Create the test suite
        browserify:
            test:
                src: 'test/main.coffee'
                dest: 'test/bin/main.js'
                options: debug: true

            options: transform: ['coffeeify']

        # Refresh automagically
        watch:
            rebuild:
                files: ['test/main.coffee', 'test/unit/*.coffee', 'lib/**/*']
                tasks: ['default']
            options: livereload: 35729

    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-browserify'

    grunt.registerTask 'default', ['browserify']

