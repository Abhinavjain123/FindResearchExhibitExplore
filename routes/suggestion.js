const express = require('express');
const router = express.Router({mergeParams:true});
const suggestions = require('../controllers/suggestion')
const catchAsyns = require('../utils/catchAsync');
const { validateSuggestion, isLoggedIn, isSuggestionAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateSuggestion, catchAsyns(suggestions.createSuggestion))

router.delete('/:suggestionId', isLoggedIn, isSuggestionAuthor, catchAsyns(suggestions.deleteSuggestion))

module.exports = router;