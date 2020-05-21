const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    keyword:{
        type:String,
    },
    articles:[],
})

module.exports = mongoose.model('newsSchema', newsSchema)