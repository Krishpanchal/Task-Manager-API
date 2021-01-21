const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./tasks")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a postive number");
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
} , {
  timestamps: true
})

// Virtual Field

// The ref option, which tells Mongoose which model to populate documents from.
// The localField and foreignField options. 
// Mongoose will populate documents from the model in ref whose foreignField matches this document's localField.

userSchema.virtual("tasks" , {
  ref: "Task",
  localField : "_id",
  foreignField : "owner"
})

userSchema.methods.toJSON = function () {
  const user = this

  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject

}

userSchema.methods.generateAuthToken = async function () {//methods are accessable on the instances of the model ( instance methods )
  const user = this
  const token = jwt.sign({ _id: user._id.toString()} , process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async(email , password) => {  // static methods are accessable on the models (Model methods)

    const user = await User.findOne({ email })
    
    if(!user){
      throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password , user.password) // Bcrypt provides methods which converts the user entered password to hash and checks it with the hashed password and returns boolean

    if(!isMatch){
      throw new Error("Unable to login")
    }

    return user
  }


//Hash the user password before storing into the database
userSchema.pre('save' , async function(next){
  const user = this
  
  if(user.isModified("password")){
    user.password = await bcrypt.hash(user.password , 8)
  }

  next()
})

//Remove all the user tasks before removing the user
userSchema.pre('remove' , async function(next){
  const user = this

  await Task.deleteMany({ owner: user._id})
  next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;
