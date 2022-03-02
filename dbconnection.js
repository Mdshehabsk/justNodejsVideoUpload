const mongoose = require('mongoose')

const connection = async ()=>{
    try{
        var con = await mongoose.connect(process.env.DB_PORT)
    console.log(`db connect success`)
    }catch(err){
        console.log(`db not connect`)
    }
}

module.exports = connection;