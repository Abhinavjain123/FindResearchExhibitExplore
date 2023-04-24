const express = require('express');
const router = express.Router();
const seminar = require('../controllers/seminar')
const catchAsyns = require('../utils/catchAsync');
const { isLoggedIn, validateSeminar} = require('../middleware')

router.route('/')
    .get(catchAsyns(seminar.index))
    .post(isLoggedIn, validateSeminar, catchAsyns(seminar.createSeminar))
    
router.get('/new', seminar.renderNewSeminar)

router.route('/:id')
    .get(catchAsyns(seminar.showSeminar))

module.exports = router;
