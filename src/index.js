const express = require("express")
require("./db/mongoose") //Runs this file first to connect the database
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT

app.use(express.json()) //This will automatically parse the upcoming json into JS Object so that we can use it.
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});

