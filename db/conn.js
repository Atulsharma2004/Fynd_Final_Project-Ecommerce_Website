require('dotenv').config()
const mongoose = require('mongoose')

// console.log(process.env.MONGO_URL)
//mongodb atlas connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log(err)

})