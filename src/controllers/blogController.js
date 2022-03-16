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
    let array = [];
    let authorId = req.query.authorId;
    let category = req.query.category;
    let tags = req.query.tags;
    let subcategory = req.query.tags;
    let blogs = await BlogModel.find({
      $or: [
        { authorId: authorId },
        { category: category },
        { tags: tags },
        { subcategory: subcategory },
      ],
    });

    if (blogs.length > 0) {
      for (let element of blogs) {
        if (element.isDeleted === false && element.isPublished === true) {
          array.push(element);
        }
      }
      res.status(200).send({ data: array, status: true });
    } else {
      res.status(200).send({ status: false, msg: "this blog is not avilable" });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message, status: false });
  }
};

const updatedBlog = async (request, response) => {
  try {
    const id = request.params.blogId;
    const data = request.body;
    const fetchData = await BlogModel.findById(id);
    if (fetchData.isPublished) {
      data.publishedAt = new Date();
      data.isPublished = true;
      const dataRes = await BlogModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return response.status(200).send({
        status: true,
        msg: dataRes,
      });
    }
    return response.status(404).send({
      status: false,
      Error: "Blog Not Found !",
    });
  } catch (error) {
    return response.status(500).send({
      Error: error.message,
    });
  }
};
const deletedBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = await BlogModel.findById(id);
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

const deleteByQuery = async (req, res) => {
  try {
    const data = req.query;
    const fetchData = await BlogModel.find(data);
    if (!fetchData.length) {
      return res.status(404).send({
        status: false,
        msg: "Blog not found!",
      });
    }
    for (let i = 0; i < fetchData.length; i++) {
      if (!fetchData[i].isDeleted) {
        const dataRes = await BlogModel.updateMany(data, { isDeleted: true });
        res.status(200).send({ status: true, msg: dataRes });
      }
      return res.status(404).send({
        status: false,
        msg: "Blog not found !",
      });
    }
  } catch (error) {
    return res.status(500).send({
      "Error: ": error.message,
    });
  }
};


module.exports = {
  createBlogs,
  getBlogs,
  updatedBlog,
  deletedBlog,
  deleteByQuery,
  };
