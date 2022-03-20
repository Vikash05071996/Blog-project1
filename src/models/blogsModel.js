const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: "title is required", trim: true },
    body: { type: String, required: "body is required", trim: true },
    authorId: {
      type: ObjectId,
      ref: "Author",
      required: "Author Id is required",
    },
    tags: { type: [String], trim: true },
    category: { type: String, required: "Blog category required", trim: true },
    subcategory: { type: [String], trim: true },

    isPublished: {
      type: Boolean,
      deafault: false,
    },
    PublishedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", BlogSchema);
