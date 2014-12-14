module.exports = function (grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>',
        concat: {
            dist: {
                src: ['source/*.js', 'source/lib/*.js', 'source/fontlists/*.js'],
                dest: 'bin/perfectfont.js'
            }
        },
        uglify: {
            dist: {
                src: 'bin/perfectfont.js',
                dest: 'bin/perfectfont.min.js'
            }
        },
        cssmin: {
            css: {
                src: 'source/perfectfont.css',
                dest: 'bin/perfectfont.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['cssmin', 'concat', 'uglify']);
};