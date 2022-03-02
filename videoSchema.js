const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    video:{
        require:true,
        type:String,
    }
})

const videoModel= new mongoose.model('videomodel', videoSchema)

module.exports = videoModel;