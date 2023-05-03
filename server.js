const express=require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv=require("dotenv").config();
connectDb();

 const app=express();

const port=process.env.PORT || 5000;
app.use(express.json())
app.use("/api/property",require("./routes/propertyRoutes"))
app.use("/api/users",require("./routes/userRoutes"))
app.use(errorHandler);
app.use('/uploads',express.static('uploads'))

if(!module.parent){
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    
})
}
module.exports = {app};