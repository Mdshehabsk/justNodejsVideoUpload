require('dotenv').config()
const express = require('express')
const connection = require('./dbconnection')
const videoModel = require('./videoSchema')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static(`${__dirname}/public`))
app.get('/',async (req,res,next)=>{
    const video =await videoModel.find();   
    res.render('index',{video:video})
    
})

const storage = multer.diskStorage({
    destination: (req,file,next)=>{
        if(!fs.existsSync('public')){
            fs.mkdirSync('public')
        }
        next(null , 'public/')
    },
    filename : (req,file,next)=>{
        const filename = Date.now() + file.originalname
         next(null ,filename)
    }
})

const upload = multer({
    storage,
    fileFilter : (req,file,next)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4' && ext !== '.mkv' && ext !== '3gp'){
           return next(new Error ('only videos are allowed'))
        }
        next (null , true)
    }
})

app.post('/video' ,upload.single('video') ,async (req,res,next)=>{
    try{
        const file = req.file.filename
        console.log(file)
        const saveVideo = new videoModel({
            video: file
        })
        await saveVideo.save()
        res.redirect('/')
    }catch(err){
        res.send(err)
    }
    
})
app.post('/videoDelete/:id',async (req,res,next)=>{
    var id = req.params.id;
   const videoDelete = await videoModel.findByIdAndDelete({_id:id})
    fs.unlinkSync(`./public/${videoDelete.video}`)
    res.redirect('/')
})

// db connection
connection()
app.listen(process.env.PORT,()=>{
    console.log(`server running successfull`)
})