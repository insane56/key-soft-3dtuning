"use strict";

var fs = require('fs');
var path = require('path');

var assetsDir = [
    '/angular/controllers/', 
    '/angular/directives/', 
    '/angular/services/',
    '/angular/services/tuning/',
    '/angular/filters/',
    '/angular/providers/',
    '/angular/directives/tuning/',
    '/angular/directives/feed/',
    '/tuning/'
];

var adminAssetsDir = [
    '/angular/controllers/',
    '/angular/directives/',
    '/angular/directives/cars/',
    '/angular/services/',
    '/angular/filters/'
];

/**
 * Creates a file list of js assets from specified directories
 * @return {Array} Array of js files for inclusion in non-production versions
 */
exports.assetFiles = function (forAdmin) {
    var files = [];
    var assets = forAdmin ? adminAssetsDir : assetsDir;

    var rootFolder = forAdmin ? 'admin' : 'app';

    var relPrefix = forAdmin ? '/admin' : '/js';

    for(var i = 0; i < assets.length; i++) {
        var fsList = fs.readdirSync('./' + rootFolder + assets[i]);

        for(var j = 0; j < fsList.length; j++) {
            var file = path.join(process.cwd(), rootFolder, assets[i], fsList[j]);
            
            if(fs.statSync(file).isFile() && path.extname(file) === '.js') {
                var relFilePath = relPrefix + assets[i] + fsList[j]/* + '?t=' + new Date().getTime()*/;
                if (fsList[j] == 'controller.js') {
                    files.unshift(relFilePath)
                } else {
                    files.push(relFilePath);
                }
            }
        }
    }

    return files;
};