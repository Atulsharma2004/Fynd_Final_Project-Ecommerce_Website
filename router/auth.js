const express=require('express');
const router = express.Router();
const bcrypt=require('bcryptjs')
// const app=express();
// const bcrypt = require('bcryptjs');

require('../db/conn');
const userModel =require('../model/userSchema');
const contactModel = require('../model/contactSchema')
const productModel = require('../model/productSchema')

router.get('/',(req, res)=>{
    res.send('Welcome To Fresh and Real Fruits, Vegetables and Fast Foods... Go to /home');
})

//Signup api
router.post('/signup', async (req, res) => {
    try {
        const result = await userModel.findOne({ email: req.body.email });

        if (result) {
            res.status(422).send({ message: "Email already exists", alert: false });
        } else {
            const data = new userModel(req.body);
            await data.save();
            res.send({ message: "Successfully signed up", alert: true });
        }
    } catch (err) {
        // Handle errors here
        // console.error(err);
        res.status(500).send({ message: "An error occurred" });
    }
})


// contact api
router.post('/contact', async (req, res) => {
    try {
        const result = await userModel.findOne({ email: req.body.email });
        if (!result) {
            res.status(422).send({ message: "Please login for contact...", alert: false });
        }else{
                const data = new contactModel(req.body);
                await data.save();
                res.send({ message: "Message sent successfully!", alert: true });
            }
            
    } catch (err) {
        // Handle errors here
        // console.error(err);
        res.status(500).send({ message: "An error occurred" });
    }
})




//Login Api
router.post('/login', async (req, res) => {
    try {
        const result = await userModel.findOne({ email: req.body.email });
        // console.log("result",result)
        if (result) {
            const isMatch = await bcrypt.compare(req.body.password, result.password);
            if (isMatch) {
                const datasend = {
                    id: result._id,
                    fname: result.fname,
                    lname: result.lname,
                    email: result.email,
                    image: result.image
                };
                res.status(422).send({ message: "Logged in Successfully", alert: true, data: datasend });
            } else {
                res.send({ message: "Invalid User Credentials" })
            }
        } else {
            res.send({ message: "User Not Found ! Please Register", alert: false });
        }
    } catch (err) {
        // Handle errors here
        // console.error(err);
        res.status(500).send({ message: "An error occurred" });
    }
})

// save products in database

router.post("/saveProduct", async (req, res) => {
    // console.log(req.body)
    const data = await productModel(req.body)
    const dataSave = await data.save()
    res.send({ message: "Uploaded Successfully" })
})

// fetch api for products
router.get('/product', async (req, res) => {
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

// Endpoint to receive data from Arduino
router.post('/api/data', async (req, res) => {
    try {
        // Log the received data for debugging
        console.log("Received data from Arduino:", req.body);

        // Validate the request body
        if (!req.body || !req.body.potentiometer_value || !req.body.pwm_value) {
            return res.status(400).send({ message: "Invalid data received", success: false });
        }

        // Process or store the data as needed
        const receivedData = {
            potentiometer_value: req.body.potentiometer_value,
            pwm_value: req.body.pwm_value,
            potentiometer_voltage: req.body.potentiometer_voltage,
            motor_voltage: req.body.motor_voltage,
            base_voltage: req.body.base_voltage
        };

        console.log("Processed data:", receivedData);

        // Respond to the client
        res.status(200).send({ message: "Data received successfully", success: true });
    } catch (error) {
        console.error("Error processing data from Arduino:", error);
        res.status(500).send({ message: "Internal server error", success: false });
    }
});



module.exports = router;
