const express = require("express");
const mongoose = require("mongoose");
const cors = require ("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());


//Defined for providing services to the customers 
const SecurityService = mongoose.model("SecurityService", new mongoose.Schema({
    name:String,
    description:String,
    price:Number
}));

//Defined for booking
const Booking = mongoose.model("Booking", new mongoose.Schema({
    serviceId: { type:mongoose.Schema.Types.ObjectId, ref:"SecurityService"},
    bookingDate: Date,
    userId: {type: mongoose.Schema.Types.ObjectId,ref:"User"},
}));

//Setting up Nodemailer Transporter
const transporter = 

