const mongoose = require("mongoose")
const validator = require("validator")

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("DB connected");
  }).catch((error) => {
    console.log("Error");
  })


