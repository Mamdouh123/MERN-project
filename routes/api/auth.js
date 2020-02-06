const express = require('express');
const auth = require("../../middleware/auth");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
//auth: middleware that takes token from http header and decodes it returning the user id in the db
//GET: returns db data for the current user (token sent in header)
router.get('/', auth, async (req,res)=>{
    try{

        const user = await User.findById(req.user).select('-password');
        res.json(user);
    }catch(err){
        res.json({msg: "user not found"})
        console.error(err);
    }
});

//POST: takes email and password and checks db
//if creds are valid, return token
router.post('/', [
    check('password', 'enter a password').not().isEmpty(),
    check('email', 'enter a valid email').isEmail()
], async (req,res)=>{
    let errorsArray = validationResult(req);
    if(!errorsArray.isEmpty()){
        return res.status(400).json(errorsArray);
    }
    var {email, password} = req.body;
    
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json([{msg: "wrong creds"}]);
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({msg:'wrong creds'})
        }
        var payload = { id : user.id };
        jwt.sign(payload, config.get('secret'), {expiresIn: 360000}, (err, token)=>{
        if(err) throw err;
        res.json({token});
        } );

    }catch(err){
        console.error(err.message);
        res.status(500).json([{msg: "database error"}]);
    }
});

module.exports = router;