module.exports = (grunt) ->
  'use strict'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    # Create the test suite
    browserify:
      options:
        transform: ['coffeeify']

      example:
        src: 'example/src/main.coffee'
        dest: 'example/bin/main.js'
        options:
          debug: true
          aliasMappings: [
            cwd: 'lib/'
            src: ['**/*.coffee']
            dest: 'robo/'
          ]

      test:
        src: 'test/main.coffee'
        dest: 'test/bin/main.js'
        options: debug: true

    # Refresh automagically
    watch:
      options: livereload: 35729
      rebuild:
        files: [
          'test/main.coffee'
          'test/unit/*.coffee'
          'lib/**/*.coffee'
          'example/src/**/*.coffee'
        ]
        tasks: ['default']

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.registerTask 'default', ['browserify']

