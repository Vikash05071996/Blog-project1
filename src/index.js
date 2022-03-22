const express=require('express')
const bodyParser=require('body-parser')
const route=require('./route/route.js')
const {default:mongoose}=require('mongoose')
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://ManojKoli:ManojKoli@cluster0.kwqvp.mongodb.net/Manoj?authSource=admin&replicaSet=atlas-shard-w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
,{
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/',route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});