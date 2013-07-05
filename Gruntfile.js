module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        jshint: {
            all: [
                'src/**/*.js'
            ]
        }

    });

    // plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('default', ['lint']);

};
