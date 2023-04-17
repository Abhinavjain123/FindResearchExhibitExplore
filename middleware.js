const ExpressError = require('./utils/ExpressError');
const {paperSchema} = require('./schemas')
const Papers = require('./models/paper');

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
