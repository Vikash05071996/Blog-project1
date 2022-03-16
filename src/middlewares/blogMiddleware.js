const jwt = require("jsonwebtoken");
const BlogModel = require("../models/blogsModel");




const mid1 = (req, res, next) => {
  try {
    //Authentication
    const token = req.headers["x-api-key"];
 
    if (!token) {
      return res
      .status(401)
      .send({ status: false, msg: "token must be present" });
    }
    
    let id2=req.query.authorId
    let id3=req.body.authorId

    //Authorization
    const decodedToken = jwt.verify(token, "backend-project");
    if (decodedToken.authorId !== (id2 || id3)) {
      return res
        .status(401)
        .send({ status: false, msg: "you must have to login first" });
    }
    next();
  } catch (err) {
    res.status(500).send({status: false, msg: err.message});
  }
};

const mid2 = async function (req, res, next) {
  try {
    //Authentication
    const token = req.headers["x-api-key"];
    if (!token) {
      return res
      .status(401)
      .send({ status: false, msg: "token must be present" });
    }


    const id = req.params.blogId;
    let id2=req.query.authorId
    const data = await BlogModel.findById(id);
    const authorId = data.authorId;

    //Authorization
    var decodedToken = jwt.verify(token, "backend-project");
    if (decodedToken.authorId == (authorId || id2) ) {
    next();
    }
    else{
      res
        .status(404)
        .send({ status: false, msg: "it is not valid blogId,please enter valid blogId" });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports = { mid1,mid2};
