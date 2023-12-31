const router=require('express').Router();
const User=require('../models/User');
const Post=require('../models/Post');
const bcrypt=require('bcrypt');
const cors = require('cors');

// Apply CORS middleware for the entire router
router.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// UPDATE
router.put('/:id', async (req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);

    if(req.body.userId===req.params.id){
        if(req.body.password){
            const salt=await bcrypt.genSalt(10)
            req.body.password=await bcrypt.hash(req.body.password,salt);
        }
        try {
            const updatedUser=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new:true});
            const user=await updatedUser.save();
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(401).json("You can update only your account!");
    }
})


// DELETE
router.delete('/:id', async (req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);

    if(req.body.userId===req.params.id){
        try {
            const user=await User.findById(req.params.id);
            if(!user){
                return res.status(404).json("User not found");
            }
            try {
                await Post.deleteMany({username:user.username});
                await User.findByIdAndDelete(req.params.id);
                return res.status(200).json("User has been deleted");
            } catch (error) {
                return res.status(500).json(err);
            }
        } catch (error) {
            return res.status(500).json(err);
        }
    }else{
        return res.status(401).json("You can delete only your account!");
    }
})

// GET USER
router.get('/:id',async (req,res)=>{
    res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);

    try {
        const user=await User.findById(req.params.id);
        const {password,...others}=user._doc;
        return res.status(200).json(others);
    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports=router;
