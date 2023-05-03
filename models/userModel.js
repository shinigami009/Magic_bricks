const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    
     username:{
        type:String,
        required:[true,"Please enter the username"]
     },
     email:{
        type:String,
        required:[true,"Please enter the user email address"],
        unique:[true,"Please enter the user email address"],

     },
     password:{
        type:String,
        required:[true,"Please add the user password"]
     },
     number:{
      type:String,
      required:[true,"Please enter the number"]
   },
   name:{
      type:String,
      required:[true,"Please enter the name"]
   },
},{
    timestamps:true,
})
module.exports=mongoose.model("User",userSchema)