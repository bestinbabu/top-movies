const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../customError");
const axios = require("axios");
const {redisClient} = require("../db/redis-connect");
const Movie = require("../model/movie");


const getUserMovieList = async (req, res) => {

  const key = `${req.user.userID}:movieList`
  const cachedResult = await redisClient.get(key)
  if (cachedResult) {
    res.status(StatusCodes.OK).json({msg:"cache hit",data:JSON.parse(cachedResult)})
    return
  }
  const movieList = await Movie.findOne({user:req.user.userID}).select('-_id -user -__v');
  const EXP_TIME = 60 * 60 * 12
  await redisClient.setEx(key,EXP_TIME,JSON.stringify(movieList));
  res.status(StatusCodes.OK).json({ msg: "sucess" ,data:movieList});
};


const findMovie = async (req, res) => {

  const {title} = req.body
  if(!title) {
    throw new BadRequest("Please provide the title of the movie to search")
  }
  const key = req.body.title
  const cachedResult = await redisClient.get(key)

  if (cachedResult) {
    res.status(StatusCodes.OK).json({msg:"cache hit",data:JSON.parse(cachedResult)})
    return
  }

  const options = {
    method: "GET",
    url: "https://ott-details.p.rapidapi.com/search",
    params: req.body,
    headers: {
      "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
      "X-RapidAPI-Host": "ott-details.p.rapidapi.com",
    },
  };
  let allResults = []
  while (true) {
  const response = await axios.request(options)
  const {results} = response.data

  if (!results || results.length === 0 ) {
    break
  }
  allResults = [...allResults,...results]
  options.params.page++
  await new Promise(resolve => setTimeout(resolve, 1000));
}
  const EXP_TIME = 60 * 5
  await redisClient.setEx(key,EXP_TIME,JSON.stringify(allResults));

res.status(StatusCodes.OK).json({ msg: "cache miss",data:allResults});
};


const addMovie = async (req, res) => {
  const {MovieImdbid,rank} = req.body

  if (!MovieImdbid || !rank) {
    throw new BadRequest("please provide all the details")
  }
  const options = {
    method: 'GET',
    url: 'https://ott-details.p.rapidapi.com/gettitleDetails',
    params: {imdbid: MovieImdbid},
    headers: {
      'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
      'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
    }
  };
  const response = await axios.request(options)

  if (!response) {
    throw new BadRequest("no movie with that imdbid")
  }
  const  movieDetails = {imdbid, genre, released, title} = response.data
  movieDetails.rank = rank

  const movieList = await Movie.findOne({user:req.user.userID})
  if (!movieList) {
    await Movie.create({user:req.user.userID,movies:[movieDetails]})
    res.status(StatusCodes.OK).json({ msg: "sucess",data:movieDetails});
    return

  }
  
  movieList.movies.push(movieDetails)
  await movieList.save()
  
  redisClient.del(`${req.user.userID}:movieList`)
  res.status(StatusCodes.OK).json({ msg: "sucess",data:movieDetails});
};

const updateMovie = async (req,res) => {
  const {MovieImdbid,rank} = req.body
  if (!MovieImdbid || !rank) {
    throw new BadRequest("please provide MovieImdbid and rank")
  }

  const movie = await Movie.findOneAndUpdate(
    { user: req.user.userID, movies: { $elemMatch: { imdbid: MovieImdbid } } },
    { $set: { 'movies.$.rank': rank } },
    {new:true}
  ).select('-_id -user -__v');
  
  if (!movie) {
    throw new BadRequest("the movie is not in your favourite list")
    return
  }

  redisClient.del(`${req.user.userID}:movieList`)
  res.status(StatusCodes.OK).json({ msg: "sucess",data:movie});

}

const deleteMovie = async (req, res) => {

  const {id:MovieImdbid} = req.params
  if (!MovieImdbid) {
    throw new BadRequest("please provide the movie id")
  }

  const newMovieList = await Movie.updateOne(
    {user:req.user.userID},
    {$pull:{movies:{imdbid:MovieImdbid}}},
    {new:true} 
    )
  if (!newMovieList) {
    throw new BadRequest("the movie is not in")
  }

  redisClient.del(`${req.user.userID}:movieList`)
  res.status(StatusCodes.OK).json({ msg: "sucess",data:newMovieList });
};

module.exports = {
  findMovie,
  addMovie,
  updateMovie,
  deleteMovie,
  getUserMovieList,
};
