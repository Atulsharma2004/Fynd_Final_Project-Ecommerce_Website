const mongoose = require('mongoose')
const bcrypt= require('bcryptjs');

const userSchema = mongoose.Schema({
    fname: String,
    lname: String,
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: String,
    cpassword: String,
    image: String
})


userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
        this.cpassword=await bcrypt.hash(this.cpassword,10);
    }

    next();
})

//Modal

const userModel = mongoose.model('user', userSchema)

module.exports= userModel;