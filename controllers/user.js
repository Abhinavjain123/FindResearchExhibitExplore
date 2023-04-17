const User = require('../models/user')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.renderRegPage = (req,res) =>{
    const {typeOfUser} = req.body;
    if(typeOfUser == "ngo"){
        res.redirect("/registerOrg")
    }else{
        res.redirect("/registerUser")
    }
}

module.exports.renderOrgRegister = (req,res)=>{
    res.render('organisation/orgRegistration')
}

module.exports.renderUserRegister = (req,res)=>{
    res.render('users/enduser/userRegistration')
}

module.exports.registerOrganisation = async(req,res)=>{
    try{
        const {username, password, ngoName, ngoMail, phoneNumber, govtId, add1, add2, city, state, zipCode , ngoImage} = req.body;
        const user = new User({username, ngoName, ngoMail, phoneNumber, govtId, add1, add2, city, state, zipCode , ngoImage})
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','Welcome to FREE!');
            res.redirect('/papers');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.registerUser = async(req,res)=>{
    try{
        const {username, password, firstName, middleName, lastName, email, phnNumber, gender, aadhaar, dateOfBirth, add1, add2, city, state, zipCode , userImage} = req.body;
        const user = new User({username, firstName, middleName, lastName, email, phnNumber, gender, aadhaar, dateOfBirth, add1, add2, city, state, zipCode , userImage})
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','Welcome to FREE!');
            res.redirect('/papers');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome Back!!!');
    const redirectedUrl = req.session.url || '/papers';
    res.redirect(redirectedUrl);
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success', 'Logged Out!!');
    res.redirect('/papers');
}