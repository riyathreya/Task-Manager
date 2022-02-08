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

//get tasks?completed=true  --> filtering 
//get tasks?limit=10&skip=0 --> pagination
//get tasks?sortBy=fieldname_desc  --> sorting (fieldname and sorting order)
router.get('/tasks', auth, async (req,res) => {
    try{
        //get all tasks which have been created by the authenticated user
        //const tasks = await Task.find({owner: req.user._id }); 
        //await req.user.populate('tasks').execPopulate(); //getting all relevant tasks for a user using the populate fcn
        const match = {}
        const sort = {}
        
        if(req.query.completed){
            match.completed = req.query.completed === 'true';
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split('_');
            sort[parts[0]] = parts[1] === 'asc'? 1: -1
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(e) {
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id });//get tasks that belong to the user only
        if(!task){
            return res.status(404).send();
        }
        return res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

//task updates 
router.patch('/tasks/:id', auth, async (req, res) => {
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

        const task = await Task.findOne({_id: req.params.id,owner: req.user._id });
        

        if(!task){
            res.status(404).send();
        }
        
        updates.forEach((update) => {
            task[update] = req.body[update]  //get the adta dynamically, do not use . notation
        })
        
        await task.save();
        res.send(task); 
    }catch(e){
        res.status(500).send();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await  Task.deleteOne({ _id: req.params.id, owner: req.user._id });

        if(!task){
            res.status(404).send();
        }

        res.status(200).send(task);

    }catch(e){
        res.status(500).send(); 
    }
})

module.exports = router;