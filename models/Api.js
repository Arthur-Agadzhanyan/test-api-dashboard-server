const {Schema,model,Types} = require('mongoose')

const schema = new Schema({
    name:{
        type:String, 
        required:true, 
        unique: true 
    },
    api:{
        type:String,
        required:true, 
        unique: true 
    },
    description:{
        type:String,
        required:true, 
        unique: true 
    }
})

module.exports = model('Api',schema)