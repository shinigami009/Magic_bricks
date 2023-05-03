const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        status:"failed",
        error: "Validation Failed",
        message: err.message,
        
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        status:"failed",
        error: "Not Found",
        message: err.message,
       
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        status:"failed",
        error: "Unauthorized",
        message: err.message,
        
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        status:"failed",
        error: "Forbidden",
        message: err.message,
        
      });
      break;
    
    default:
      console.log("No error");
      break;
  }
};

module.exports = errorHandler;