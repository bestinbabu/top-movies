const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const movieSchema = moongoose.Schema({
  imdbid: {
    type: String,
    required: true,
  },
  genre: [
    {
      type: String,
      required: true,
    },
  ],
  released: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    default:false,
  },
  type: { type: String, required: true },

});

const movieListSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    movies:[movieSchema]
})

module.exports = moongoose.model('MovieList',movieListSchema)
