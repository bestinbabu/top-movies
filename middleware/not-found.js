const {StatusCodes} = require("http-status-codes")

const notFoundMiddleware = async (req,res) => {
    res.status(StatusCodes.NOT_FOUND).json({msg:"page not available"})

}

module.exports = notFoundMiddleware