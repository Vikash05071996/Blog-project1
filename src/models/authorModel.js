const mongoose = require('mongoose')
const validator=require("validator")
const AuthorSchema = new mongoose.Schema({

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    title: {
        type: String, required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate:{validator:validator.isEmail,
                message: '{VALUE} is not a valid email',
                isAsync: false
    
        
        }
    },
    password: {
        type: String,
        unique: true,
        require: true

    }

}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema)
