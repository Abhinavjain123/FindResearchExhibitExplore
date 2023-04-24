const Seminar = require('../models/seminar');

module.exports.index = async (req,res)=>{
    const seminars = await Seminar.find({});
    res.render('seminar/index', { seminars});
}

module.exports.renderNewSeminar = async(req,res)=>{
    res.render('seminar/new')
}

module.exports.createSeminar = async (req,res)=>{
    const seminar = new Seminar(req.body.seminar);
    seminar.author = req.user._id;
    await seminar.save();
    req.flash('success', 'Successfully added a new seminar');
    res.redirect(`/seminars`);
}

module.exports.showSeminar = async (req,res)=>{
    const { id } = req.params;
    const seminar = await Seminar.findById(id).populate('author');
    if(!seminar){
        req.flash('error', 'Seminar does not exist!!')
        return res.redirect('/seminar');
    }
    res.render('seminar/show', { seminar});
}

// module.exports.deleteSuggestion = async(req, res)=>{
//     const {id, suggestionId} = req.params;
//     await Paper.findByIdAndUpdate(id, {$pull: {suggestions:suggestionId}});
//     await Suggestion.findByIdAndDelete(suggestionId);
//     req.flash('success', 'Successfully deleted suggestion');
//     res.redirect(`/papers/${id}`)
// }