const router=require('express').Router();
const Category=require('../models/Category');
const cors = require('cors');

// Apply CORS middleware for the entire router
router.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

router.post('/',async(req,res)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
    
    const newCat=new Category(req.body);
    try {
        const savedCat=await newCat.save();
        return res.status(200).json(savedCat);
    } catch (error) {
        return res.status(500).json(error);
    }
})

router.get('/',async(req,res)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
    try {
        const cats=await Category.find();
        return res.status(200).json(cats);
    } catch (error) {
        return res.status(500).json(error);
    }
})


module.exports=router;
