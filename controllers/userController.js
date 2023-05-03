const asyncHandler= require("express-async-handler")
const bcrypt = require("bcrypt");
const User=require("../models/userModel");
const jwt = require("jsonwebtoken");
const logger=require('../middleware/logger')
const  registerUser=asyncHandler(async(req,res)=>{
    const { username, email, password,number,name} = req.body;
    if (!username || !email || !password||!number||!name) {
      res.status(400);
      
      throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      number,
      name,
    });
  
    console.log(`User created ${user}`);
    if (user) {
      res.status(201).json({
        status:"success",
        
        _id: user.id, email: user.email });
        logger.customerLogger.log('info','successfully user is created')
    } else {
      res.status(400);
      logger.customerLogger.log('error','Error while creating user')
      throw new Error("User data is not valid");
    }
   
    
});


const  loginUser=asyncHandler(async(req,res)=>{
    const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    logger.customerLogger.log('error','Error All fields should be present')
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          name:user.name,
          number:user.number
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "150m" }
    );
    res.status(200).json({
      status:"success",
      token: accessToken });
      logger.customerLogger.log('info','successfully logged in')
  } else {
    res.status(401);
    logger.customerLogger.log('error','Error while logging in')
    throw new Error("email or password is not valid");
  
  }
 
   
});

const  currentUser=asyncHandler(async(req,res)=>{
      const data=req.user
    res.json({  
      status:"success",
       data
    
    });
    logger.customerLogger.log('info','successfully  reviewing the profile')
});

module.exports={registerUser,loginUser,currentUser}