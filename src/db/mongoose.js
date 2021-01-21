const mongoose = require("mongoose")
const validator = require("validator")

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => {
    console.log("DB connected");
  }).catch((error) => {
    console.log("Error from DB");
  })


