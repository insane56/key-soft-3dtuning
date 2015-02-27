"use strict";
/**
 * Helper functions for authorization
 * @author tatevik.bozoyan@simplytech.co
 * @author Alexander Adamyan
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');

var tokens = require('./libs/tokens');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var SNResponseProcessor = require('./auth-strategies/');

var TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;


var config = require('./config');
var log = require('./libs/log')(module);

exports.signin = function (res, user) {
    var token = user.id + (user.roles ? '|' + user.roles.join(',') : '');
    res.cookie('token', tokens.encryptText(token), { domain: config.domain, maxAge: TOKEN_EXPIRY }); //set cookies for one week
};

exports.signout = function (res) {
    res.clearCookie('token', {path: '/'});
};

exports.getUserByToken = function (req, res, next) {
    var token = req.cookies['token'] ? req.cookies['token'] : null;

    if (token) {
        token = tokens.decryptText(token);
        if (!token) return next();

        var parsed = token.split('|');
        req.user = parsed[0];
    }

    next();
};

/**
 * Middleware for checking the existence of authorized user
 * @param {Object} req express response object
 * @param {Object} res express response object
 * @param {Function} next the callback function of middleware chain
 */
exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.user).select('-__v -hashedPassword -salt -sqlId').exec(function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.clearCookie('token', {path: '/'});
                return res.send(401);
            }

            res.cookie('token', req.cookies['token'], { domain: config.domain, maxAge: TOKEN_EXPIRY }); //set cookies for one week

            req.user = user;
            next();
        });
    } else res.send(401);
};

/**
 * Middleware for checking the existence of required role
 * @param {String} role
 */
exports.requiresRole = function (role) {
    return function (req, res, next) {
        if (!req.user) {
            res.clearCookie('token', {path: '/'});
            return res.send(401);
        }

        var hasRole = req.user.roles.indexOf(role) != -1;
        if (!hasRole) {
            return res.send(403);
        }

        return next();
    };
};

/*
 * Method for checking the existence of required role
 * @param {String} role
 * @param {Function} callback
 */
exports.hasRole = function (user, role, callback) {
    if (!user) {
        return callback(false);
    }

    if (user.roles && user.roles.indexOf('admin') !== -1) {
        return callback(true);
    }

    User.findById(user, function (err, dbUser) {
        if (err) {
            return callback(false);
        }
        if (dbUser && dbUser.roles.indexOf('admin') !== -1) {
            return callback(true);
        }

        callback(false);
    });
};

/**
 * Middleware for updating lastActivityDate property of user
 * @param req
 * @param res
 * @param next
 */
exports.updateUserLastActivity = function (req, res, next) {
    if (!req.user) throw new Error('updateUserLastActivity should be after requiresLogin middleware');

    req.user.lastActivityDate = new Date();

    res.save(next);
};


var strategies = exports.strategies = {
    facebook: new FacebookStrategy(config.sn.facebook, SNResponseProcessor.processFBResponse),
    twitter: new TwitterStrategy(config.sn.twitter, SNResponseProcessor.processTwitterResponse),
    vkontakte: new VKontakteStrategy(config.sn.vk, SNResponseProcessor.processVKResponse),
    vkMobile: new VKontakteStrategy(config.sn.vkm, SNResponseProcessor.processVKResponse),
    google: new GoogleStrategy(config.sn.google, SNResponseProcessor.processGoogleResponse)
};

/**
 * Configuring passport for authentication
 * @param {Object} passport instance of the passport.js
 * @param {Object} config
 */
exports.boot = function (passport, config) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
    });

    // Local strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username }).select('-__v -sqlId -avatar._id').exec(function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user || !user.authenticate(password)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }

            done(null, user);
        });
    }));    

    passport.use(strategies.facebook);
    passport.use(strategies.vkontakte);
    passport.use(strategies.google);
};