const express=require("express");
const multer=require("multer");
const Property=require("../models/propertyModel");
const upload=require("../middleware/upload")
const asyncHandler = require("express-async-handler");
const router=express.Router();
const validateToken=require('../middleware/validateTokenHandler');
constcsvtojson=require('csvtojson')
const {getProperty,
    addcsvProperty,
    deleteProperty,
    getaProperty,
    updateProperty,
    createProperty,
    getallProperty,
    getnearProperty}=require("../controllers/propertyController")
router.use(validateToken);

router.post("/",upload.single('avatar'),createProperty)
router.post("/findnearby",getnearProperty)
router.post("/addcsv",upload.single('file'),addcsvProperty)
// router.post('/addcsv',upload.single('avi'),async(req,res)=>{
//     csvtojson()
//     .fromFile(req.file.path)
//     .then(csvData=>{
//         console.log(csvData);
//         Property.insertMany(csvData).then(function(){
//             console.log("Data inserted");
//             res.json({status:"success"})
//         }).catch(function(error){
//             console.log(error)
//         })
//     })
    
// })
router.get("/",getProperty)
router.route("/all").post(getallProperty);
router.route("/:id").get(getaProperty).put(updateProperty).delete( deleteProperty)

module.exports=router;