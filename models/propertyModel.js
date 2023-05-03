const mongoose=require("mongoose");
const contactSchema=mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      
      ref: "User",
    },

    residency_name:{
      type:String,
   
   },
    address:{
      type:String,
   
   }, 
   area:{
      type:String,
     
   },
   type:{
      type:String,
    
      //pg flat 
   }, 
   room_type:{
      type:String,
     
      //3bhk 2bhk 1bhk
   },
 price:{
    type:Number,
 
 },
 owner_number:{
    type:String,
  
 },
 property_size:{
    type:String,
   
 },
 booking_status:{
   type:String,
   
   //booked vacant
},

imagepath:{
   type:String,
 
},
lat:{
   type:String,

},
long:{
   type:String
},
city:{
   type:String
}
 
},
{
    timestamps:true,
   })
module.exports=mongoose.model("property",contactSchema);