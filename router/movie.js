const express = require("express")
const router = express.Router()

const {authenticateUser} = require("../middleware/auth") 
const {findMovie, addMovie, updateMovie, deleteMovie, getUserMovieList, getOtherUserMovieList} = require("../controller/movie")

router.get("/search/",authenticateUser,findMovie)
router.get("/search/:id",authenticateUser,getOtherUserMovieList)
router.route("/").post(authenticateUser,addMovie).get(authenticateUser,getUserMovieList).patch(authenticateUser,updateMovie)
router.delete("/:id",authenticateUser,deleteMovie)

module.exports = router