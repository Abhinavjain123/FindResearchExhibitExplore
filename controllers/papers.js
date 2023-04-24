const Paper = require('../models/paper');

module.exports.index = async (req,res)=>{
    const papers = await Paper.find({});
    res.render('papers/index', { papers});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('papers/new')
}

module.exports.createPaper = async(req,res)=>{
    const paper = new Paper(req.body.paper);
    paper.author = req.user._id;
    await paper.save();
    req.flash('success', 'Successfully added a new paper');
    res.redirect(`/papers/${paper._id}`);
}

module.exports.showPaper = async (req,res)=>{
    const { id } = req.params;
    const paper = await Paper.findById(id).populate({
        path: 'suggestions',
        populate: {
            path: 'author'
        }
        }).populate('author');
    if(!paper){
        req.flash('error', 'Paper does not exist!!')
        return res.redirect('/papers');
    }
    res.render('papers/show', { paper});
}

module.exports.renderEditForm = async (req,res)=>{
    const { id } = req.params;
    const paper = await Paper.findById(id);
    if(!paper){
        req.flash('error', 'Paper does not exist!!')
        return res.redirect('/papers');
    }
    res.render('papers/edit', { paper});
}

module.exports.updatePaper = async(req,res)=>{
    const { id } = req.params;
    const paper = await Paper.findByIdAndUpdate(id,{...req.body.paper})
    await paper.save();
    req.flash('success', 'Successfully updated paper');
    res.redirect(`/papers/${id}`);
}

module.exports.deletePaper = async(req, res)=>{
    const { id } = req.params;
    await Paper.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted paper');
    res.redirect('/papers')
}