const express = require('express');
const router = express.Router();
const papers = require('../controllers/papers')
const catchAsyns = require('../utils/catchAsync');
const { isLoggedIn, validatePaper, isAuthor } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsyns(papers.index))
    .post(isLoggedIn, upload.array('image'), validatePaper, catchAsyns(papers.createPaper))
    
router.get('/new', papers.renderNewForm)

router.route('/:id')
    .get(catchAsyns(papers.showPaper))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePaper , catchAsyns(papers.updatePaper))
    .delete(isLoggedIn, isAuthor, catchAsyns(papers.deletePaper))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyns(papers.renderEditForm))

module.exports = router;