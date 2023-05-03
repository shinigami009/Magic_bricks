const asyncHandler= require("express-async-handler")
const Property=require("../models/propertyModel");
const csv= require('csvtojson')
const logger=require('../middleware/logger')

const getnearProperty=asyncHandler(async(req, res)=>{
  const { lat, long } = req.body;
  const radius = 6371; // Radius of earth in km
  const properties = await Property.find({
    city: req.body.city,
    lat: { $ne: null },
    long: { $ne: null },
  });

  const propertiesWithDistance = properties
    .map((property) => {
      const dLat = ((parseFloat(lat) - parseFloat(property.lat)) * Math.PI) / 180;
      const dLon = ((parseFloat(long) - parseFloat(property.long)) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((parseFloat(lat) * Math.PI) / 180) *
          Math.cos((parseFloat(property.lat) * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = radius * c;

      return { property: property._doc, distance: distance.toFixed(2) + " km" };
    })
    .filter(({ property }) => property.lat && property.long)
    .sort((a, b) => a.distance - b.distance);

  res.json(propertiesWithDistance);
  logger.customerLogger.log('info','Properties nearby are displayed successfully')
});



const getallProperty = asyncHandler(async (req, res) => {
  let query = { booking_status: "vacant" };

  if (req.body.area && Array.isArray(req.body.area)) {
    query.area = { $in: req.body.area };
  } else if (req.body.area) {
    query.area = req.body.area;
  }

  if (req.body.room_type) {
    query.room_type = req.body.room_type;
  }

  if (req.body.type) {
    query.type = req.body.type;
  }

  if (req.body.min_price && !isNaN(req.body.min_price)) {
    query.price = { $gte: parseInt(req.body.min_price) };
  }

  if (req.body.max_price && !isNaN(req.body.max_price)) {
    if (query.price) {
      query.price.$lte = parseInt(req.body.max_price);
    } else {
      query.price = { $lte: parseInt(req.body.max_price) };
    }
  }

  console.log(query);

  let allProperties = Property.find(query);

  if (req.body.sort_order) {
    const sortOption = { price: req.body.sort_order === 'asc' ? 1 : -1 };
    allProperties = allProperties.sort(sortOption);
  }

  allProperties = await allProperties.exec();

  if (allProperties.length === 0) {
    res.status(404);
    logger.customerLogger.log('error','Properties are not found')
    throw new Error("No properties found");
  }

  res.status(200).json({
    status: "success",
    data: { allProperties },
  });
  logger.customerLogger.log('info','All properties are displayed')
});


const addcsvProperty = asyncHandler(async (req, res) => {
  const response = await csv().fromFile(req.file.path);
  console.log(response)
  if (response.length===0) {
    res.status(404);
    logger.customerLogger.log('error','Failed to read CSV')
    throw new Error("Failed to read CSV file");
  }

  await Property.insertMany(response);

  res.status(200).json({
    status: "success",
    msg: "CSV imported",
  });
  logger.customerLogger.log('info','CSV is successfully imported')
});



const getProperty= asyncHandler(async (req,res)=>{
   const properties= await Property.find({user_id:req.user.id});
   console.log(properties.length)
 
    res.status(200).json({
        status:"success",
        data:  {properties},
    
     })
     logger.customerLogger.log('info',' all Properties are displayed')
})


const createProperty= asyncHandler (async (req,res)=>{
   
  const {area,type,address,residency_name,room_type,
          price,owner_number,booking_status, property_size}=req.body;  

          if(!area||!type||!address||!residency_name||!room_type
                    ||!price||!owner_number||!booking_status){
                    res.status(400);
                    throw new Error("All fields are mandatory");
                }
console.log(req.file);
  const property=new  Property({
    area,
    type,
    address,
    residency_name,
    room_type,
    owner_number,
    booking_status,
    price,
    property_size,
    imagepath: req.file.filename,
    user_id: req.user.id,

      
})
   


property
.save()
.then(()=> res.status(200).json({
    status:"success",
    data:{property}
   
 }))
.catch((err)=>console.log(err))


})

const getaProperty= asyncHandler (async (req,res)=>{
    const property=await Property.findById(req.params.id);
    console.log(property)
    if(!property){
        res.status(404);
        logger.customerLogger.log('error','Property not found')
        throw new Error("Property not found");
      
    }
    if (property.user_id.toString() !== req.user.id) {
        res.status(403);
        logger.customerLogger.log('error','User dont have permission to get other user Property')
        throw new Error("User don't have permission to get other user Property");
      }
      const imageurl='http://localhost:5001/uploads/'+property.imagepath;
     
      property.url = {
        imageurl
      };
   
    res.status(200).json({
        status:"success",
        data:  {property,imageurl},

     })
     logger.customerLogger.log('info','a single property is displayed')
})
const updateProperty= asyncHandler (async (req,res)=>{
   const property=await Property.findById(req.params.id);
   if(!property){
    res.status(404);
    logger.customerLogger.log('error','Property not found')
    throw new Error("Property not found");

   }

   if (property.user_id.toString() !== req.user.id) {
    res.status(403);
    logger.customerLogger.log('error','User dont have permission to get other user Property')
    throw new Error("User don't have permission to update other user property");
  }
   const updatedProperty=await Property.findByIdAndUpdate(
    req.params.id,
    req.body,{new:true}
   );
   
    res.status(200).json({
        status:"success",
        data:  {updatedProperty}
     })
     logger.customerLogger.log('info','Successfully updated')
})



const deleteProperty=asyncHandler (async (req,res)=>{
    const property=await Property.findById(req.params.id);
    if(!property){
        res.status(404);
        logger.customerLogger.log('error','Property not found')
        throw new Error("Property not found");
    
       }
       if (property.user_id.toString() !== req.user.id) {
        res.status(403);
        logger.customerLogger.log('error','User dont have permission to get other user Property')
        throw new Error("User don't have permission to delete other user Property");
      }
      await Property.deleteOne({ _id: req.params.id });

      res.status(200).json({
        status:"success",
        data:  null,
     });
     logger.customerLogger.log('info','Successfully deleted')
     console.log("successfully deleted")
   
   
    
})
module.exports={addcsvProperty,updateProperty,getaProperty,createProperty,getProperty,deleteProperty,getallProperty,getnearProperty}