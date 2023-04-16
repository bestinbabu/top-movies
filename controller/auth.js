const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated, Unauthorized } = require("../customError");
const User = require("../model/user");
const { createToken, attachCookies } = require("../utils");

const register = async (req, res) => {
  const userDetails = ({ email, password, firstName, lastName } = req.body);

  if (!email || !password || !firstName || !lastName) {
    throw new BadRequest("please enter all the details");
  }

  const checkDupEmail = await User.findOne({ email });
  if (checkDupEmail) {
    throw new BadRequest("email already exists");
  }

  const role = (await User.countDocuments({})) === 0 ? "admin" : "user";
  userDetails.role = role;
  console.log(userDetails);
  const userData = await User.create(userDetails);
  const CustomToken = createToken(userData);
  attachCookies(res, CustomToken);

  res.status(StatusCodes.CREATED).json({ data: CustomToken });
};


const login = async (req, res) => {
  
  const {email,password} = req.body
  if(!email || !password) {
    throw new BadRequest("please enter all the details")
  }

  const userDetails = await User.findOne({email:email})
  if(!userDetails) {
    throw new Unauthenticated("invalid credentials")
  }
  const passwordMatches = await userDetails.comparePassword(password)
  
  if(!passwordMatches) {
    throw new Unauthenticated("incorrect email or password")
  }

  const CustomToken = createToken(userDetails);
  await attachCookies(res, CustomToken);

  res.status(StatusCodes.OK).json({ data: CustomToken });
}
const logout = async (req, res) => {
  {
    res.cookie("cookie",req.cookies.tokenCookie,{
        httpOnly:true,
        expires:new Date(Date.now() + 5),
        secure:false,
        sighned: false,
    })
    res.status(StatusCodes.OK).json({status:"logout sucess"})
}
};

const resetPassword = async (req, res) => {

  const {oldPassword,newPassword} = req.body
  const user = await User.findOne({_id:req.user.userID})
  const oldPasswordMatches = await user.comparePassword(oldPassword)
  if (!oldPasswordMatches) {
    throw new Unauthenticated("invalid password")
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({sucess:true});

};

module.exports = {
  login,
  logout,
  resetPassword,
  register,
};
