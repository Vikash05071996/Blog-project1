const authorModel = require("../models/authorModel");
const BlogModel = require("../models/blogsModel");

const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    if (data.isPublished == true) {
      data["PublishedAt"] = new Date();
    }

    let authorId = data.authorId;
    let authorReq = await authorModel.findById(authorId);
    if (req.user != data.authorId) {
      return res.status(400).send("You are not authorized to get this blog");
    }
    if (authorReq) {
      let BlogsCreated = await BlogModel.create(data);
      res.status(201).send({ data: BlogsCreated, status: true });
    } else {
      res.status(400).send({
        msg: `${authorId}is not avilable,please enter the valid authorId`,
        status: false,
      });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const getBlogs = async function (req, res) {
  try {
    let { category, authorId, tags, subcategory } = req.query;
    
    let obj = {};
    if (category != null) obj.category = category;
    if (authorId != null) obj.authorId = authorId;
    if (tags != null) obj.tags = tags;
    if (subcategory != null) obj.subcategory = subcategory;
    
      obj.isDeleted = false
      obj.isPublished = true
      
      let blogData = await BlogModel.find(obj);
  
      if(blogData.length>0){
      let authId=blogData[0].authorId
      if (req.user != authId) {
        return res.status(400).send("You are not authorized to get this blog");
      }
    }
    else{
      res.status(404).send({status:false, msg:"Data not found"})
    }

    if (blogData[0].isDeleted == false && blogData[0].isPublished == true) {
      if (blogData.length>0) {
        res.status(200).send({ status: true, msg: blogData });
      }
    } else {
      res.status(404).send({ status: false, msg: "Blog not found" });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message, status: false });
  }
};

const updatedBlog = async (req, res) => {
  try {
    const id = req.params.blogId;
    const data = req.body;
    const fetchData = await BlogModel.findById(id);
    let authId = fetchData.authorId;
    if (req.user != authId) {
      return res.status(400).send("You are not authorized to update this blog");
    }
    if (fetchData.isPublished) {
      data.publishedAt = new Date();
      data.isPublished = true;
      const dataRes = await BlogModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return res.status(200).send({
        status: true,
        msg: dataRes,
      });
    }
    return res.status(404).send({
      status: false,
      Error: "Blog Not Found !",
    });
  } catch (error) {
    return res.status(500).send({
      Error: error.message,
      msg: "Invalid Input",
    });
  }
};
const deletedBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = await BlogModel.findById(id);

    if (req.user != data.authorId) {
      return res.status(400).send("You are not authorized to delete this blog");
    }
    if (data) {
      if (data.isDeleted == false) {
        let data2 = await BlogModel.findOneAndUpdate(
          { _id: id },
          { isDeleted: true, deletedAt: new Date() },
          { new: true }
        );
        res.status(200).send({ status: true, msg: data2 });
      } else {
        res.status(200).send({ status: false, msg: "data already deleted" });
      }
    } else {
      res.status(404).send({ status: false, msg: "id does not exist" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


const deleteByQuery = async function (req, res) {
  try {
    let { category, authorId, tags, subcategory } = req.query;
    let obj = {};
    if (category != null) obj.category = category;
    if (authorId != null) obj.authorId = authorId;
    if (tags != null) obj.tags = tags;
    if (subcategory != null) obj.subcategory = subcategory;

    let blogData = await BlogModel.find(obj);
    if(blogData.length>0){
    let authId=blogData[0].authorId
    if (req.user != authId) {
      return res.status(400).send("You are not authorized to get this blog");
    }
  }else{
    res.status(404).send({status:false, msg:"Data not found"})
  }
    if (blogData[0].isDeleted === false && blogData[0].isPublished === true) {
      if (blogData.length>0) {
       let blogDeleted= await BlogModel.updateMany({_id:{ $in:blogData}},{$set:{isDeleted:true, deletedAt:new Date}})
        res.status(200).send({ status: true, msg: blogDeleted });
      } else {
        res.status(404).send({ status: false, msg: "Blog not found" });
      }
    }
    else{
      res.status(400).send({status:false, msg:"Blog already deleted"})
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.meassage });
  }
};

module.exports = {
  createBlogs,
  getBlogs,
  updatedBlog,
  deletedBlog,
  deleteByQuery,
};
