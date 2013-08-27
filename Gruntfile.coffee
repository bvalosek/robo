module.exports = (grunt) ->
  'use strict'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    # Create the test suite
    browserify:
      options: transform: ['coffeeify']

      test:
        src: 'test/main.coffee'
        dest: 'test/bin/main.js'
        options: debug: true


    # Refresh automagically
    watch:
      options: livereload: 35729
      rebuild:
        files: ['test/main.coffee', 'test/unit/*.coffee', 'lib/**/*']
        tasks: ['default']

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.registerTask 'default', ['browserify']

