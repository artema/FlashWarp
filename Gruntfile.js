module.exports = function(grunt) {
	
  "use strict";
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      },
      build: {
        src: 'js/flashwarp.js',
        dest: 'dist/flashwarp.min.js'
      }	  
    },
	watch: {
		js: {
			files: ['js/flashwarp.js'],
			tasks: ['uglify']
		}
 	}
  });

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};