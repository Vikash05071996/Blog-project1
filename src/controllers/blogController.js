const authorModel = require("../models/authorModel")
const BlogModel=require("../models/blogsModel")

const createBlogs=async function(req,res){
    try{
    let data=req.body
    if(data.isPublished==true){
        data["PublishedAt"]=new Date()
    }

     let authorId=data.authorId
     let authorReq=await authorModel.findById(authorId)
     if(authorReq){

    let BlogsCreated=await BlogModel.create(data)
    res.status(201).send({data:BlogsCreated,status:true})

}else{

    res.status(400).send({msg:`${authorId}is not avilable,please enter the valid authorId`,status:false})

}



    }
    catch(err){
        res.status(500).send({msg:err.message})
    }


}

const getBlogs=async function(req,res){

    try{
        let array=[]
     let authorId=req.query.authorId
     let category=req.query.category
     let tags=req.query.tags
     let subcategory=req.query.tags
     let blogs=await BlogModel.find({$or:[{authorId:authorId},{category:category},{tags:tags},{subcategory:subcategory}]})
      
     if(blogs.length>0){
         for(let element of blogs){
             if (element.isDeleted===false && element.isPublished===true){

                array.push(element)
             }
         }
         res.status(200).send({data:array,status:true})
     }else{
         res.status(200).send({status:false,msg:"this blog is not avilable"})
     }

    }
     catch(err){
         res.status(500).send({msg:err.message,status:false})
     }
    
}

const updatedBlog = async function (req, res) {
    const Id = req.params.blogId
    try {
        if (Id) {
            let data = await BlogModel.findById(Id)
            if (data.isDeleted == false) {
    let value1 = req.body.bodyupdate
        let value2 = req.body.title
          const arr2 = req.body.subcategory
          const arr1 = req.body.tags
           data.tags = data.tags.concat(arr1)
               const result1 = data.tags.filter(b => b != null)
                console.log(data.tags)
                data.subcategory = data.subcategory.concat(arr2)
                const result2 = data.subcategory.filter(b => b != null)
                console.log(data.subcategory)
   let data2 = await BlogModel.findOneAndUpdate({ _id: Id }, { title: value2, body: value1, tags: result1, subcategory: result2 }, { new: true })
                if (data.isPublished == false)
      data2 = await BlogModel.findOneAndUpdate({ _id: Id }, { isPublished: true, publishedAt: Date.now() }, { new: true })
                res.status(200).send({ status: true, msg: data2 })
            }
            else
                res.status(404).send({ status: "false", msg: "data is already deleted" })

        }
        else
            res.status(404).send({ status: "false", msg: "id is not exist" })

    }
    catch (err) { res.status(500).send({ message:err.message }) 
    }
}


const BlogDeleted = async function (req, res) {
    try {
        let id = req.params.blogId
        let data = await BlogModel.findById(id)
        if (data) {
            if (data.isDeleted == false) {
                 let data2 = await BlogModel.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt:new Date() }, { new: true })
                res.status(200).send({ status: true, msg: data2 })
            } else {
                res.status(200).send({ status: false, msg: "data already deleted" })
            }
        } else {
            res.status(404).send({ status: false, msg: "id does not exist" })
        }

    }
    catch (err) { res.status(500).send({status:false, message:err.message }) }
}
module.exports.createBlogs=createBlogs
module.exports.getBlogs=getBlogs
module.exports.updatedBlog=updatedBlog
module.exports.BlogDeleted=BlogDeleted