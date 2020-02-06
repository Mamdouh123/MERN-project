const express = require('express');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

router.post('/', [
    check('name', 'enter a valid name').not().isEmpty(),
    check('password', 'enter a valid password').isLength({min: 6}),
    check('email', 'enter a valid email').isEmail()
], async (req,res)=>{
    let errorsArray = validationResult(req);
    if(!errorsArray.isEmpty()){
        return res.status(400).json(errorsArray);
    }
    var {name, email, password} = req.body;
    
    let user = await User.findOne({name});
    if(user){
        return res.status(400).json([{msg: "user already exists"}]);
    }
    try{
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        user = new User({name, email, password});
        await user.save();

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