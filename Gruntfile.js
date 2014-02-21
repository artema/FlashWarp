module.exports = function(grunt) {
	
  "use strict";
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  require("grunt-jsdoc");

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
	jsdoc : {
		dist : {
	    	src: ['js/*.js'], 
	        options: {
	            destination: 'doc'
	        }
	    }
	},
	watch: {
		js: {
			files: ['js/flashwarp.js'],
			tasks: ['uglify']
		}
 	}
  });

  grunt.registerTask('default', ['uglify', 'jsdoc']);
};