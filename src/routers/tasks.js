const express = require('express');

const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth')


// router.post('/tasks', (req,res) => {
//     const task = new Task(req.body);
//     task.save().then(() => {
//         res.status(201).send(task);
//     }).catch((err) => {
//         res.status(400).send(err);
//     })
// })

// router.get('/tasks', (req,res) => {
//     Task.find({}).then((tasks) => {
//         res.send(tasks)
//     }).catch((e) => {
//         res.status(500).send();
//     })
// })

// router.get('/tasks/:id', (req,res) => {
//     Task.findById(req.params.id).then((task) => {
//         if(!task){
//             res.status(404).send("Task not found")
//         }
//         res.send(task);
//     }).catch((e) => {
//         res.status(500).send();
//     })
// })

router.post('/tasks', auth, async (req, res) => {
    try{
        // const task = new Task(req.body)
        // task.owner = req.user._id;
        //or

        const task = new Task({
            ...req.body, 
            owner: req.user._id
        })
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasks', async (req,res) => {
    try{
        const task = await Task.find({ });
        res.send(task);
    }catch(e) {
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

//task updates 
router.patch('/tasks/:id', async (req, res) => {
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed']
        const validUpdates = updates.every((update) => {
            return allowedUpdates.includes(update);
        })

        if(!validUpdates) {
            res.status(400).send("invalid columns for updates. description and commmpleted keys only can be updated");
        }

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

        const task = await Task.findById(req.params.id);
        updates.forEach((update) => {
            task[update] = req.body[update]  //get the adta dynamically, do not use . notation
        })
        
        await task.save();

        if(!task){
            res.status(404).send();
        }
        res.send(task); 
    }catch(e){
        res.status(500).send();
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await  Task.findByIdAndDelete(req.params.id);

        if(!task){
            res.status(404).send();
        }

        res.status(200).send(task);

    }catch(e){
        res.status(500).send(); 
    }
})

module.exports = router;