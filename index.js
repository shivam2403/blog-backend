const express=require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const authRoute=require('./routes/auth');
const userRoute=require('./routes/users');
const postsRoute=require('./routes/posts');
const categoryRoute=require('./routes/categories');
const multer=require('multer');
const cors=require('cors');
const path=require('path');
const helmet = require('helmet');

dotenv.config();
app.use(express.json());
app.use('/images',express.static(path.join(__dirname,"/images")))


mongoose.connect(process.env.MONGO_URL)
.then(console.log('Connected to MONGODB'))
.catch((err)=>console.log(err));


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name)
    }
})
const upload=multer({storage:storage});
app.post('/api/upload',upload.single('file'),(req,res)=>{
    return res.status(200).json('File has been uploaded');
});

app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/posts',postsRoute);
app.use('/api/categories',categoryRoute);

app.options('*', cors());

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
  )

app.listen('5000',()=>{
    console.log("Backend is running...");
})
