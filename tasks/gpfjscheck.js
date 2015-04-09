/*
 * grunt-gpf-jscheck
 * https://github.com/lcustodio/grunt-gpf-jscheck
 *
 * Copyright (c) 2015 Luis Custodio
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var jsCheck = require("gpf-jscheck");

    grunt.registerMultiTask('gpfjscheck', 'Grunt plugin for gpf-jscheck created by Arnaud Buchholz', function () {

        //in order to allow jsCheck to run async.
        var done = this.async();

        // Merge task-specific and/or target-specific options with these defaults.
        var configuration = this.options({
            //helper: grunt.file.expand("./node_modules/gpf-jscheck/test/rules/*.js"),
            //runBaseRules: true,
            verbose: true,
            files: [
                "test/scenarios/*.js"
            ],
            rules: [
                "test/rules/*.js"
            ]
        });

        var gpfVerbose = (configuration.verbose === undefined) ? false : configuration.verbose;
        var gruntVerbose = (grunt.option('verbose') === undefined) ? false : grunt.option('verbose');

        configuration.verbose = gpfVerbose || gruntVerbose;

        //if(configuration.runBaseRules){
        //    runBaseRules(configuration);
        //}

        jsCheck.initConfig(configuration);

        jsCheck.run(function (event){

            if(configuration.verbose) {
                grunt.log.writeln(" Event type: " + event.type);
            }
            if(0 === event.type.indexOf("log")){
                logEventHandling(event);
                return;
            }

            if (event.type === jsCheck.EVENT_DONE) {
                //if (event.get("errors").length) {
                //    done(false);
                //    return(false);
                //}
                done(true);
                grunt.log.ok("... No critical validation errors.");
            }
        });
    });

    function logEventHandling(event){

        if(event.type === jsCheck.EVENT_LOG_INFO){
            grunt.log.writeln(event.get("message"));
        }
        if(event.type === jsCheck.EVENT_LOG_WARN){
            grunt.log.errorlns(event.get("message"));
        }
        if(event.type === jsCheck.EVENT_LOG_ERROR){
            grunt.warn(event.get("message"));
        }
    }

    function runBaseRules(configuration){

        var module = require.resolve("gpf-jscheck");
        delete require.cache[module];

        var jsCheck = require("gpf-jscheck");

        var baseConfiguration = JSON.parse(JSON.stringify(configuration));
        baseConfiguration.rules = [ require("gpf-jscheck/test/rules/*") ];

        jsCheck.initConfig(baseConfiguration);

        jsCheck.run(function (event){

            if(configuration.verbose) {
                grunt.log.writeln(" Event type: " + event.type);
            }
            if(0 === event.type.indexOf("log")){
                logEventHandling(event);
                return;
            }

            if (event.type === jsCheck.EVENT_DONE) {
                //if (event.get("errors").length) {
                //    done(false);
                //    return(false);
                //}
                //done(true);
                grunt.log.ok("... No critical validation errors.");
            }
        });
    }

  grunt.registerMultiTask('gpfjscheckBase', 'Grunt plugin for gpf-jscheck created by Arnaud Buchholz', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
