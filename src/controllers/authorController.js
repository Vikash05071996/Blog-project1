const AuthorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
let createAuthors = async function (req, res) {
  try {
    let data = req.body;
    let createAuthor = await AuthorModel.create(data);
    res.status(201).send({ data: createAuthor, status: true });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const loginAuthor = async function (req, res) {
  try {
    let data = req.body;
    if (data.email && data.password) {
      let author = await AuthorModel.findOne({
        email: data.email,
        password: data.password,
      });
      if (author) {
        let payload = {
          authorId: author._id.toString(),
          batch: "thorium",
          organisation: "FunctionUp",
        };

        let token = jwt.sign(payload, "backend-project");
        res.status(200).send({ status: true, data: author, token: token });
      } else {
        res
          .status(400)
          .send({ status: false, msg: "invalid email and password" });
      }
    } else {
      res.status(400).send({
        status: false,
        msg: "request body must contain email and password",
      });
    }
  } catch (err) {
    res.status(400).send({ status: "something went wrong", error: err });
  }
};

module.exports.createAuthors = createAuthors;
module.exports.loginAuthor = loginAuthor;

