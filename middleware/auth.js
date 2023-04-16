const { checkJWT } = require("../utils");
const { Unauthenticated,Unauthorized } = require("../customError");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.tokenCookie;
    const validToken = await checkJWT(token);
    if (!validToken) {
      throw new Unauthenticated("invalid token");
    }
    req.user = {
      userID: validToken.userID,
      firstName: validToken.firstName,
      lastName: validToken.lastName,
      email: validToken.email,
      role: validToken.role,
    };
    next();
  } catch (error) {
    console.log(error);
  }
};

const authorizeUser = ({userRoles}) => {
    return (req,res,next) => {
        if (!userRoles.includes(req.user.role)) {
            throw new Unauthorized("Unauthorized access")
        }
        next()
    }
}


module.exports = {
  authenticateUser,
  authorizeUser
};
