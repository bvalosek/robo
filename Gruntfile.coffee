module.exports = (grunt) ->
  'use strict'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    browserify:
      options:
        transform: ['coffeeify'] # <3

      # Semi-testing example, map robo stuff to start with 'robo/' via the
      # aliasMappings option
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

      # Create the test suite
      test:
        src: 'test/main.coffee'
        dest: 'test/bin/main.js'
        options: debug: true

    # Clean code is happy code
    coffeelint:
      lib: ['lib/**/*.coffee']
      test: ['test/**/*.coffee']
      example: ['example/src/**/*.coffee']
      grunt: ['Gruntfile.coffee']

    # Refresh anytime we change something
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

    qunit: all: ['test/index.html']

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-coffeelint'

  grunt.registerTask 'lint', ['coffeelint']
  grunt.registerTask 'test', ['lint', 'browserify:test', 'qunit']

  grunt.registerTask 'default', ['browserify']
