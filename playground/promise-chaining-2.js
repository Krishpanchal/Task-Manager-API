require("../src/db/mongoose");
const Task = require("../src/models/tasks")


// Task.findByIdAndDelete("60013c656366d133c839d972").then((task) => {
//     console.log(task);
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result);
// })


const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed : false})
    return count
}

deleteTaskAndCount("60013b34cb20f140504bf995").then((count) => {
    console.log(count);
}).catch(e => {
    console.log(e);
})