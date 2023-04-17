const Campground = require('../models/paper');

module.exports.index = async (req,res)=>{
    const papers = await Campground.find({});
    res.render('papers/index', { papers});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('papers/new')
}

module.exports.createCampground = async(req,res)=>{
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/papers/${campground._id}`);
}

module.exports.showCampground = async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground does not exist!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground});
}

module.exports.renderEditForm = async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground does not exist!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground});
}

module.exports.updateCampground = async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename : { $in : req.body.deleteImages} } } } );
    }

    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async(req, res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds')
}