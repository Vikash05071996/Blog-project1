const express=require('express');
const router=express.Router();

const authorController= require("../controllers/authorController")
const blogController=require("../controllers/blogController")

const authMiddleware=require("../middlewares/blogMiddleware")


router.post('/createAuthors',authorController.createAuthors)

router.post('/createBlogs',authMiddleware.mid1,blogController.createBlogs)
router.get('/getBlogs',authMiddleware.mid1,blogController.getBlogs)

router.put('/updatedBlog/:blogId',authMiddleware.mid1,blogController.updatedBlog)
router.delete('/blogDeleted/:blogId',authMiddleware.mid1,blogController.deletedBlog)

router.delete('/deleteByQuery',authMiddleware.mid1,blogController.deleteByQuery)

router.post('/loginAuthor',authorController.loginAuthor)




module.exports=router;