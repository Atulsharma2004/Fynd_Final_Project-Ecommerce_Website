require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Stripe = require('stripe')
const app = express()
const path=require('path')
require('./db/conn');


app.use(cors())
app.use(express.json({ limit: "10mb" }))




//  Link the router files to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT || 8080
const secreat_key = process.env.STRIPE_SECRET_KEY

app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})


const userModel = require('./model/userSchema');
const contactModel = require('./model/contactSchema')

const productModel= require('./model/productSchema')



// ------------ Payment gateway

const stripe = new Stripe(secreat_key)
app.post('/checkout-payment', async (req, res) => {
    // console.log(req.body)

    try {
        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            shipping_options: [{ shipping_rate: process.env.SHIPPING_RATE_KEY }],
            line_items: req.body.map((item) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                            // images: [item.image],
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.qty
                }
            }),
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        }
        const session = await stripe.checkout.sessions.create(params)
        res.status(200).json(session.id);
    } catch (error) {
        res.status(error.statusCode || 500).json(error.message)
    }
    // res.send({message : "Payment Gateway", success : true})
})





app.listen(PORT, () => {
    console.log(`Server is running at port : ${PORT}`)
})
