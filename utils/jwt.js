const jwt = require("jsonwebtoken")

const createJWT = (customToken) => {

    return jwt.sign(customToken,process.env.JWT_SECRECT,{
        expiresIn:process.env.JWT_LIFETIME
    })
}

const checkJWT = (token) => {
    return jwt.verify(token,process.env.JWT_SECRECT)
}

const attachCookies = async (res,customToken) => {
    
    const token =  createJWT(customToken)
    const day = 1000 * 60 * 60 * 24
    res.cookie("tokenCookie",token,{
        httpOnly:true,
        expires:new Date(Date.now() + day),
        secure:false,
        sighned: false,
    })
}

module.exports = {
    createJWT,
    checkJWT,
    attachCookies
}