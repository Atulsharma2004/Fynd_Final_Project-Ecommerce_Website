const mongoose = require('mongoose')

//contact schema
const contactSchema = mongoose.Schema({
    fname: String,
    email: {
        type: String,
    },
    message: String
})

//Modal

const contactModel = mongoose.model('contact', contactSchema)

module.exports=contactModel;