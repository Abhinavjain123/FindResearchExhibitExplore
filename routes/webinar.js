const express = require('express');
const router = express.Router();
const webinar = require('../controllers/webinar')
const { isLoggedIn, validateWebinar} = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(webinar.index))
    .post(isLoggedIn,  catchAsync(webinar.createWebinar))
    
router.get('/new', webinar.renderNewWebinar)

router.route('/:id')
    .get(catchAsync(webinar.showWebinar))

module.exports = router;
