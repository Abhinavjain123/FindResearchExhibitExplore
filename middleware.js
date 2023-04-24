const ExpressError = require('./utils/ExpressError');
const {paperSchema, suggestionSchema, webinarSchema, seminarSchema} = require('./schemas')
const Papers = require('./models/paper');
const Suggestion = require('./models/suggestion');
const Webinar = require('./models/webinar');
const Seminar = require('./models/seminar');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.url = req.originalUrl;
        req.flash('error', "You must be signed in!");
        return res.redirect('/login');
    }
    next();
}

module.exports.validatePaper = (req,res,next)=>{
    const {error} = paperSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const { id } = req.params;
    const paper = await Papers.findById(id);
    if(!paper.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!!')
        return res.redirect(`/papers/${id}`)
    }
    next();
}

module.exports.validateSuggestion = (req,res,next)=>{
    const {error} = suggestionSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isSuggestionAuthor = async(req,res,next)=>{
    const { id, suggestionId } = req.params;
    const suggestion = await Suggestion.findById(suggestionId);
    if(!suggestion.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!!')
        return res.redirect(`/papers/${id}`)
    }
    next();
}

module.exports.validateSeminar = (req,res,next)=>{
    const {error} = seminarSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.validateWebinar = (req,res,next)=>{
    const {error} = webinarSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}
