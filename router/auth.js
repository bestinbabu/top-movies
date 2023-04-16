const express = require("express")
const router = express.Router()
const {authenticateUser,authorizeUser} = require("../middleware/auth")


const  {
    login,
    logout,
    register,
    resetPassword
} = require("../controller/auth")

router.post("/login",login)
router.post("/register",register)
router.get("/logout",authenticateUser,logout)
router.post("/reset-password",authenticateUser,authorizeUser({userRoles:['user','admin']}),resetPassword)

module.exports = router


