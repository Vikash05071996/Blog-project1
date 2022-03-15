const express=require('express');
const router=express.Router();

const authorController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")

router.post('/createAuthors',authorController.createAuthors)
router.post('/createBlogs',blogController.createBlogs)
router.get('/getBlogs',blogController.getBlogs)
router.put('/updatedBlog/:blogId',blogController.updatedBlog)
router.delete('/blogDeleted/:blogId',blogController.BlogDeleted)



module.exports=router;