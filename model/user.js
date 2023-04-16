const mongoose = require('mongoose');
const valid = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    require:true,
    validate:{
        validator: valid.isEmail,
        message:"enter a valid email"
    },
    unique:true
},
  password:{
  type:String,
  require:true
},
  firstName:{
    type:String,
    require:true
  },
  lastName:{
    type:String,
    require:true
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save",async function() {
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)

})

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword,this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User
