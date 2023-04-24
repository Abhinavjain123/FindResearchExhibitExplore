const express = require('express');
const router = express.Router();
const webinar = require('../controllers/webinar')
const catchAsyns = require('../utils/catchAsync');
const { isLoggedIn, validateWebinar} = require('../middleware')

router.route('/')
    .get(catchAsyns(webinar.index))
    .post(isLoggedIn, validateWebinar, catchAsyns(webinar.createWebinar))
    
router.get('/new', webinar.renderNewWebinar)

router.route('/:id')
    .get(catchAsyns(webinar.showWebinar))

module.exports = router;
