require('../src/db/mongoose');

const Task = require('../src/models/task');

//61b0d82734db0c4d60f54e84

// Task.findByIdAndDelete('61b0d82734db0c4d60f54e84').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false});
// }).then((count) => {
//     console.log(count);
// }).catch((e) => {
//     console.log(e);
// })

const taskDeleteAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: true });

    return count;
}

taskDeleteAndCount('61b0d82734db0c4d60f54e84').then((count) => {
    console.log("result " + count);
}).catch((e) => {
    console.log("e ", e);
})
