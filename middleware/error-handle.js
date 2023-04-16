const {StatusCodes} = require("http-status-codes");

const errorHandleMiddleware = async (err,req,res,next) => {
    let customError = {
        message:err.message || "Something went wrong",
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR 
    } 
    console.log(err);
    return res.status(customError.statusCode).json({error:customError.message})
}


module.exports = errorHandleMiddleware