const express = require("express")
const Task = require("../models/tasks")
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router()


router.post("/tasks", auth, async (req, res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.send(400).send(e)
    }   
});

//localhost:3000/tasks?completed=true    ------ match
//localhost:3000/tasks?limit=3&skip=3    ------ options
//localhost:3000/tasks?sort=createdAt:desc    ------ sort

// {{url}}/tasks?completed=true&limit=2&skip=2&sortBy=createdAt:desc
router.get("/tasks" , auth, async (req , res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }

    try {
        // const tasks = await Task.find({owner : req.user._id}) //1
         await req.user.populate({  
             path: "tasks",
             match,
             options:{
                 limit: parseInt(req.query.limit),
                 skip: parseInt(req.query.skip),
                 sort
             }
         }).execPopulate() // 2. get all the tasks of the user and stores the id in the virtual field and we just to populate t oget the whole document
         res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send(e)        
    }
})

router.get("/tasks/:id" , auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id , owner: req.user._id})
       
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch("/tasks/:id", auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error : "Invalid Update!"})
    }

    try {
        const task = await Task.findOne({ _id: req.params.id , owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {

    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

            const task = await Task.findOneAndDelete({ _id: req.params.id , owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router