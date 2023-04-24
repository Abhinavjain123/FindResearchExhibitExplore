const express = require('express');
const router = express.Router();
const papers = require('../controllers/papers')
const catchAsyns = require('../utils/catchAsync');
const { isLoggedIn, validatePaper, isAuthor } = require('../middleware')

router.route('/')
    .get(catchAsyns(papers.index))
    .post(isLoggedIn, validatePaper, catchAsyns(papers.createPaper))
    
router.get('/new', papers.renderNewForm)

router.route('/:id')
    .get(catchAsyns(papers.showPaper))
    .put(isLoggedIn, isAuthor, validatePaper , catchAsyns(papers.updatePaper))
    .delete(isLoggedIn, isAuthor, catchAsyns(papers.deletePaper))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyns(papers.renderEditForm))

module.exports = router;