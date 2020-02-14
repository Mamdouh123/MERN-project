const express = require('express');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const auth = require("../../middleware/auth");
// mongoose models

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route       POST /api/posts
// @desc        create new post
// @access      private
router.post('/', [auth, [check('text', 'text is required ').not().isEmpty()]] ,  
        async (req,res)=>{
            
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                console.error(errors);
                return res.status(400).json({msg:"Text is required"});
            }

            try {
                const user = await User.findById(req.user);
                
                const newPost = {
                    text: req.body.text,
                    name: user.name,
                    avatar: user.avatar,
                    user: req.user
                }

                const post = new Post(newPost);
                await post.save();
                res.json(post);
            } catch (error) {
                console.error(error);
                return res.status(500).json({msg: "server error"});
            }

        });


// @route       GET /api/posts
// @desc        get all posts
// @access      private
router.get('/');
module.exports = router;