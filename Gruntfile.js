"use strict";

/*global module:false*/
module.exports = function(grunt) {
    var env = process.env.BUILD_ENV || 'dev';
    var basePath = require('./config').assetsCDN || '';
    var rand = process.env.ASSETS = (Date.now().toString(36));
    require('fs').writeFileSync('assetsprefix', rand);
    grunt.initConfig({

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: '50000'
                },
                src: ['init/tester.js', 'test/*.js']
            }
        },
        karma: {
            unit : {
                configFile: './test/angular/karma-unit.conf.js',
                autoWatch: true
            },
            singleRun : {
                configFile: './test/angular/karma-unit.conf.js',
                singleRun: true
            }
        },
        watch: {
            options: {
                livereload: true
            },
//            tests: {
//                files: ['libs/**/*.js', 'utils/**/*.js', 'mailer/**/*.js', 'tasks/**/*.js'],
//                tasks: ['mochaTest']
//            },
            tests: {
                files: ['test/angular/unit/**/*.js'],
                tasks: ['karma:singleRun']
            },
            styleguide: {
                files: ['assets/views/styleguide/**/*.jade', 'assets/views/apidoc/**/*.jade', 'assets/views/tools/**/*.jade'],
                tasks: ['jade:styleguide']
            },

            templates: {
                files: ['app/views/**/*.jade'],
                tasks: ['clean:views', 'jade:templates', 'clean:publictemplates', 'clean:publicviews', 'clean:publicct', 'copy:templates']
            },

            adminTemplates: {
                files: ['admin/views/**/*.jade'],
                tasks: ['clean:adminviews', 'jade:adminTemplates', 'clean:publicAdminviews', 'copy:adminTemplates']
            },

            less: {
                options: {
                    customFunctions: {
                        'formatted-url': function(less, url) {
                            return 'url(' + basePath + url.value + ')';
                        }
                    }
                },
                files: ['app/less/**/*.less', 'app/vendor-css/**/*.css'],
                tasks: ['clean:css', 'less', 'clean:publiccss', 'copy:css', 'copy:vendorcss']
            },

            app: {
                files: ['app/angular/**/*.js','app/tuning/**/*.js', 'app/custom.js'],
                tasks: ['clean:publicjs', 'copy:appjs']
            },

            admin: {
                files: ['admin/angular/**/*.js', 'admin/layout.js', 'admin/assets/**', 'admin/vendor/**'],
                tasks: ['clean:publicAdmin', 'copy:devadmin', 'karma:singleRun']
            },

            vendor: {
                files: ['app/vendor/**'],
                tasks: ['clean:publicvendor', 'copy:vendor']
            }
        },

        clean: {
            min: 'assets-tmp/min',
            app: 'assets-tmp/app',
            views: 'assets-tmp/views',
            adminviews: 'assets-tmp/admin-views',
            js: 'assets-tmp/js',
            css: 'assets-tmp/css',
            tmp: 'assets-tmp/',
            
            public: ['public/*', '!public/fonts', '!public/img', '!public/snapshots', '!public/socket.io.js', '!public/humans.txt'],

            publicviews: 'public/views',
            publictemplates: 'public/templates',
            publicct: 'public/component-types',
            publicAdminviews: 'public/admin-views',
            publicAdmin: 'public/admin',
            publicvendor: 'public/vendor',
            publiccss: 'public/css',

            publicjs: 'public/js'
        },

        ngmin: {
            app: {
                expand: true,
                cwd: 'app/angular/',
                src: ['**/*.js'],
                dest: 'assets-tmp/app/angular'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            vendor: {
                src: [
                    'app/vendor/bootstrap/js/bootstrap.js',
                    'app/vendor/async.js',
                    'app/vendor/canvas-to-blob.js',
                    'app/vendor/hammer/hammer.js',
                    'app/vendor/angular/angular-sanitize.js',
                    'app/vendor/angular/angular-resource.js',
                    'app/vendor/angular/angular-route.js',
                    'app/vendor/angular/angular-touch.js',
                    'app/vendor/angular/angular-animate.js',
                    'app/vendor/angular/angular-cookies.js',
                    'app/vendor/angular-ui-router.js',
                    'app/vendor/bindonce.min.js',
                    'app/vendor/angular-local-storage/angular-local-storage.js',
                    'app/vendor/ngInfiniteScroll/ng-infinite-scroll.js',
                    'app/vendor/angular-strap/angular-strap.js',
                    'app/vendor/angular-strap/angular-strap.tpl.js',
                    'app/vendor/moment-with-langs.min.js',
                    'app/vendor/angular-moment/angular-moment.js',
                    'app/vendor/angular-newrelic/newrelic-timing.js',
                    'app/vendor/angular-newrelic/newrelic-timing-angular.js',
                    'app/vendor/slider.js',
                    'app/vendor/socket.js',
                    'app/vendor/bootstrap-colorpicker.min.js',
                    'app/vendor/reflection.js',
                    'app/vendor/jquery.elastislide.js',
                    'app/vendor/jquery.bxslider.js',
                    'app/vendor/jquery.nicescroll.min.js',
                    'app/vendor/d3.v3.js',
                    'app/vendor/nv.d3.js',
                    'app/vendor/utils.js',
                    'app/vendor/pie.js',
                    'app/vendor/lunr.js',
                    'app/vendor/lodash.js',
                    'app/vendor/raphael-min.js',
                    'app/vendor/jquery.mapael.js',
                    'app/vendor/world_countries.js',
                    'app/vendor/load-image.min.js',
                    'app/vendor/jquery-ui/jquery.ui.widget.js',
                    'app/vendor/jquery-ui/jquery-ui-slider.custom.js',
                    'app/vendor/jquery-ui/jquery.ui.touch-punch.js',
                    'app/vendor/jquery-fileupload/jquery.iframe-transport.js',
                    'app/vendor/jquery-fileupload/jquery.fileupload.js',
                    'app/vendor/jquery-fileupload/jquery.fileupload-process.js',
                    'app/vendor/jquery-fileupload/jquery.fileupload-image.js',
                    'app/vendor/jquery-fileupload/jquery.fileupload-validate.js',
                    'app/vendor/jquery-fileupload/jquery.fileupload-angular.js',
                    'app/vendor/jquery.mCustomScrollbar.concat.min.js',
                    'app/vendor/jquery.removeWhitespace.min.js',
                    'app/vendor/jquery.smartbanner.js',
                    //'app/vendor/jquery.ba-resize.js',
                    'app/vendor/select2.js',
                    'app/vendor/select2-angular.js'

                ],
                dest: 'assets-tmp/js/vendor.js'
            },
            app: {
                src: [
                    'app/custom.js',
                    '<%= ngmin.app.dest %>/app.js',
                    '<%= ngmin.app.dest %>/**/*.js',
                    'app/tuning/controller.js',
                    'app/tuning/*.js'
                ],
                dest: 'assets-tmp/js/app.js'
            }
        },

        uglify: {
            options: {
                sourceMap: false,
                preserveComments: false,
                compress: {
                    global_defs: {
                        DEBUG: false
                    },
                    drop_console: true
                },
                mangle: {
                    toplevel: true,
                    except: ['async', 'Hammer', 'moment', 'NiceScroll', 'd3', 'nv', '_', 'eve', 'Raphael', 'angular', '$', 'lunr']
                }
            },
            vendor: {
                src: '<%= concat.vendor.dest %>',
                dest: 'assets-tmp/min/vendor.min.js'
            },
            app: {
                src: '<%= concat.app.dest %>',
                dest: 'assets-tmp/min/app.min.js'
            }
        },

        less: {
            bootstrap: {
                options: {
                    paths: ['app/less/bootstrap']
                },
                files: {
                    'assets-tmp/css/bootstrap.css': 'app/less/bootstrap/bootstrap.less'
                }
            },
            custom: {
                options: {
                    customFunctions: {
                        'formatted-url': function(less, url) {
                            return 'url(' + basePath + url.value + ')';
                        }
                    }
                },
                files: {
                    'assets-tmp/css/custom.css': 'app/less/custom/main.less',
                    'assets-tmp/css/import.css': 'app/less/custom/import.less'
                }
            },
            carInfo: {
                files: {
                    'assets-tmp/css/carInfo.css': 'app/less/custom/carInfo.less'
                }
            }
        },
        cssmin: {
            vendor: {
                files: {
                    'assets-tmp/css/vendor.css': 'app/vendor-css/*.css'
                }
            },
            app: {
                files: {
                    'assets-tmp/min/custom.min.css' : [
                        'assets-tmp/css/import.css',
                        'assets-tmp/css/bootstrap.css',
                        'assets-tmp/css/vendor.css',
                        'assets-tmp/css/custom.css'
                    ]
                }
            }
        },
        jade: {
            styleguide: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true,
                    client: false
                },
                files: [{
                        cwd: 'assets/views/styleguide/',
                        src: ['*.jade', '!layout.jade'],
                        dest: 'public/styleguide',
                        except: 'layout.jade',
                        expand: true,
                        ext: '.html'
                    },
                    {
                        cwd: 'assets/views/apidoc/',
                        src: ['index.jade'],
                        dest: 'public/apidoc',
                        expand: true,
                        ext: '.html'
                    },
                    {
                        cwd: 'assets/views/tools/',
                        src: ['*.jade', '!layout.jade'],
                        dest: 'public/tools',
                        except: 'layout.jade',
                        expand: true,
                        ext: '.html'
                    }
                ]
            },
            templates: {
                options: {
                    data: {
                        debug: env !== 'production'
                    },
                    pretty: env !== 'production',
                    client: false
                },
                files: [
                    {
                        cwd: 'app/views/templates/',
                        src: ['**/*.jade'],
                        dest: 'assets-tmp/views/views',
                        expand: true,
                        ext: '.html'
                    },
                    {
                       cwd: 'app/views/includes/',
                       src: ['**/*.jade'],
                       dest: 'assets-tmp/views/component-types',
                       expand: true,
                       ext: '.html'
                    },
                    {
                        cwd: 'app/views/directiveTemplates/',
                        src: ['**/*.jade'],
                        dest: 'assets-tmp/views/templates',
                        expand: true,
                        ext: '.html'
                    },
                    {
                        cwd: 'assets/views/apidoc/',
                        src: ['index.jade'],
                        dest: 'public/apidoc',
                        expand: true,
                        ext: '.html'
                    }
                ]
            },
            adminTemplates: {
                options: {
                    data: {
                        debug: env !== 'production'
                    },
                    pretty: env !== 'production',
                    client: false
                },
                files: [
                    {
                        cwd: 'admin/views/',
                        src: ['**/*.jade'],
                        dest: 'assets-tmp/admin-views/',
                        expand: true,
                        ext: '.html'
                    }
                ]
            }
        },
        copy: {
            adminTemplates: {
                files: [{
                    expand: true,
                    src: 'admin-views/**',
                    dest: 'public/',
                    cwd: 'assets-tmp/'
                }]
            },

            templates: {
                files: [{
                    expand: true,
                    src: '**',
                    dest: 'public/',
                    cwd: 'assets-tmp/views/'
                }]
            },

            css: {
                files: [{
                    expand: true,
                    src: '**',
                    dest: 'public/css',
                    cwd: 'assets-tmp/css'
                }]
            },

            vendorcss: {
                files: [{
                    expand: true,
                    src: '**',
                    dest: 'public/css/',
                    cwd: 'app/vendor-css'
                }]
            },

            vendor: {
                files: [{
                    expand: true,
                    src: '**',
                    dest: 'public/vendor',
                    cwd: 'app/vendor'
                }]
            },

            appjs: {
                files: [{
                    expand: true,
                    src: ['angular/**', 'tuning/**', 'custom.js'],
                    dest: 'public/js/',
                    cwd: 'app/'
                }]
            },
            app: {
                files: [{
                    expand: true,
                    src: '**',
                    dest: 'public/' + rand + '/',
                    cwd: 'assets-tmp/min/'
                },
                {
                    expand: true,
                    src: '**',
                    dest: 'public/' + rand + '/',
                    cwd: 'assets-tmp/views/'
                }]
            },
            devadmin: {
                files: [{
                    expand: true,
                    src: ['admin/**', '!admin/views/**'],
                    dest: 'public/'
                }]
            },
            admin: {
                files: [{
                    expand: true,
                    src: ['admin/**', '!admin/views/**'],
                    dest: 'public/'
                },
                {
                    expand: true,
                    src: 'admin-views/**',
                    dest: 'public/',
                    cwd: 'assets-tmp/'
                }]
            },
            img: {
                files: [{
                    expand: true,
                    src: '**',
                    dest: 'public/' + rand + '/img/',
                    cwd: 'public/img/'
                }]
            },
            robots: {
                src: 'assets/robots.txt',
                dest: 'public/robots.txt',
                options: {
                    process: function (content, srcpath) {
                        if (env === 'production') {
                            return content.replace('Disallow: /', 'Disallow:');
                        } else {
                            return content;
                        }
                    }
                }
            }
        },
        concurrent: {
            tests: {
                tasks: ['mochaTest', 'testClient'],
                options: {
                    logConcurrentOutput: true
                }
            },
            assets: ['less', 'jade', 'uglify', 'cssmin', 'concat']
        },
        protractor: {
            options: {
                configFile: 'node_modules/protractor/referenceConf.js',
                keepAlive: true,
                noColor: false
            },
            e2e: {
                configFile: 'test/angular/protractor.conf.js'
            }

        }
    });

    var scope = env === 'dev' ? undefined : ['dependencies'];
    require('load-grunt-tasks')(grunt, { scope: scope });
    require('time-grunt')(grunt);

    //Grunt tasks
    grunt.registerTask('teste2e', ['protractor:e2e']);
    grunt.registerTask('default', ['concurrent:tests', 'concurrent:assets', 'watch']);
    grunt.registerTask('test', ['concurrent:tests']);
    grunt.registerTask('testClient', ['karma:unit']);


    grunt.registerTask('css', ['clean:css', 'less']);
    grunt.registerTask('adminhtml', ['clean:adminviews', 'jade:adminTemplates'] );
    grunt.registerTask('html', ['clean:views', 'jade:templates']);
    grunt.registerTask('min', ['clean:min', 'ngmin', 'concat', 'uglify', 'cssmin']);


    grunt.registerTask('devapp', ['copy:templates', 'copy:css', 'copy:vendorcss', 'copy:vendor', 'copy:appjs']);
    grunt.registerTask('devadmin', ['copy:devadmin', 'copy:adminTemplates']);

    
    grunt.registerTask('build', ['clean:tmp' , 'clean:public', 'css', 'html', 'adminhtml', 'devapp', 'devadmin','watch']);
    grunt.registerTask('deploy', ['clean:tmp', 'clean:public', 'css', 'html', 'adminhtml', 'min', 'copy:app', 'copy:admin', 'copy:img', 'copy:robots', 'clean:tmp']);
};
