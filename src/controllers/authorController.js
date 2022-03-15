
const AuthorModel=require("../models/authorModel")

let createAuthors=async function(req,res){

    try{
        let data=req.body
        let createAuthor=await AuthorModel.create(data)
        res.status(201).send({data:createAuthor,status:true})

    }
    catch(err){
        res.status(500).send({msg:err.message})
    }


}

module.exports.createAuthors=createAuthors











