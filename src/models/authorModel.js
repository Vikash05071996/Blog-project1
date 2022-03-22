const mongoose = require('mongoose')
const validator=require("validator")
const AuthorSchema = new mongoose.Schema({

    firstname: { type: String, required: "firstname is required" },
    lastname: { type: String, required: "lastname is required" },
    title: {
        type: String, required: "title is required",
        enum: ["Mr", "Mrs", "Miss"]
    },
    
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim:true,
        required: "email is required",
        validate:{validator:validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
    
        
        }
    },
    password: {
        type: String,
        trim:true,
        require: "password is required"

    }

}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema)
