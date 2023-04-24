const Paper = require('../models/paper');
const Suggestion = require('../models/suggestion');

module.exports.createSuggestion = async (req,res)=>{
    const paper = await Paper.findById(req.params.id);
    const suggestion = new Suggestion(req.body.suggestion);
    suggestion.author = req.user._id;
    paper.suggestions.push(suggestion);
    await suggestion.save();
    await paper.save();
    req.flash('success', 'Created new suggestion')
    res.redirect(`/papers/${paper._id}`);
}

module.exports.deleteSuggestion = async(req, res)=>{
    const {id, suggestionId} = req.params;
    await Paper.findByIdAndUpdate(id, {$pull: {suggestions:suggestionId}});
    await Suggestion.findByIdAndDelete(suggestionId);
    req.flash('success', 'Successfully deleted suggestion');
    res.redirect(`/papers/${id}`)
}