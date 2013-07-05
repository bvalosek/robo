module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'src/**/*.js'
            ]
        },

        qunit: {
            all: ['test/index.html']
        }

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['lint', 'qunit']);

};
