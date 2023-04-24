const Webinar = require('../models/webinar');

module.exports.index = async (req,res)=>{
    const webinars = await Webinar.find({});
    res.render('webinar/index', { webinars});
}

module.exports.renderNewWebinar = async(req,res)=>{
    res.render('webinar/new')
}

module.exports.createWebinar = async (req,res)=>{
    const webinar = new Webinar(req.body.webinar);
    webinar.author = req.user._id;
    await webinar.save();
    req.flash('success', 'Successfully added a new webinar');
    res.redirect(`/webinars`);
}

module.exports.showWebinar = async (req,res)=>{
    const { id } = req.params;
    const webinar = await Webinar.findById(id).populate('author');
    if(!webinar){
        req.flash('error', 'Webinar does not exist!!')
        return res.redirect('/webinar');
    }
    res.render('webinar/show', { webinar});
}
