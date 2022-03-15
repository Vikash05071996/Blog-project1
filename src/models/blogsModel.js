const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const BlogSchema = new mongoose.Schema({

    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: {
        type: ObjectId, ref: "Author"
    },
    tags: [String],
    category: String,
    subcategory:[ String],
    isDeleted: {
        type: Boolean,
        default: false
    },
   
    isPublished: {
        type: Boolean,
        deafault: false
    },
    PublishedAt:{
        type:Date
    },
    deletedAt:{type:Date},


}, { timestamps: true });

module.exports = mongoose.model('Blogs', BlogSchema)

