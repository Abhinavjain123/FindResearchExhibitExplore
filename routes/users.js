const express = require('express');
const Logger = require('nodemon/lib/utils/log');
const passport = require('passport');
const users = require('../controllers/user');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(users.renderRegister)
    .post(users.renderRegPage)


router.route('/registerOrg')
    .get(users.renderOrgRegister)
    .post(catchAsync(users.registerOrganisation))

router.route('/registerUser')
    .get(users.renderUserRegister)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}) ,users.login)

router.get('/logout', users.logout);

module.exports = router;