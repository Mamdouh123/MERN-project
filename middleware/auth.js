const jwt = require('jsonwebtoken');
const config = require('config');



module.exports = function(req, res, next){
    //get token from header 
    const token = req.header("x-auth-token");
    //if token doesn't exist, return 
    if(!token){
        return res.status(401).json({msg: "no token sent"});
    }
    try{
        //if token exists, verify it against the secret set in the config file
        const decoded = jwt.verify(token, config.get('secret'));
        req.user = decoded.id;
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({msg:"invalid token"});
    }
};