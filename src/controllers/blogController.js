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
      Error: error.message,msg:"Invalid Input"
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
    if (Object.keys(req.query).length === 0) {
      return res
        .status(400)
        .send({ status: false, msg: "give right condition" });
    }

    let searchFilter = { authorId: req.body.decodedToken };

    if (req.query.authorId) {
      searchFilter.authorId = req.query.authorId;
    }

    if (req.query.tags) {
      searchFilter.tags = req.query.tags;
    }

    if (req.query.subcategory) {
      searchFilter.subcategory = req.query.subcategory;
    }

    if (req.query.isPublished) {
      searchFilter.isPublished = req.query.isPublished;
    }

    let check = await BlogModel.find(searchFilter);
    if (!check) {
      res.status(400).send({ status: false, msg: "you are not authorised" });
    }

    let deleteBlog = await BlogModel.updateMany(searchFilter, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    res.status(200).send({ status: true, msg: "deleted", data: deleteBlog });
  } catch (error) {
    res.status(400).send({ status: false, msg: error.message });
  }
};

module.exports = {
  createBlogs,
  getBlogs,
  updatedBlog,
  deletedBlog,
  deleteByQuery,
};
