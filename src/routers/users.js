const express = require('express');

const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');


//RESOURCE CREATION
// router.post('/users', (req, res) => {
//         const user = new User(req.body);

//         user.save().then(() => {
//                 res.status(201).send(user); 
//             })
//             .catch((err) => {
//                 res.status(400).send(err)
//             })   
            
// });


//using async await

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.generateAuthToken();

        res.send({ user, token }); 
    }catch(e){
        res.status(400).send(e)
    }
          
});



// //get all resources 
// router.get('/users', (req,res) => {
//     User.find({}).then((users) => {
//         res.send(users)
//     }).catch((e) => {
//         res.status(500).send();
//     })                             //Not specifying anything within brackets fetches all records from the collection
// })

//using async await
router.get('/users/me', auth, async (req, res) => { //2nd argumnt is middleware function, then 3rd argument is the actual function 
    try{
       // const users = await User.find({});
        res.send(req.user); //in auth middleware, we added the user to req object
    }
    catch(e){
        res.status(500).send(e);
    }
})


// //get a particular resource 
// router.get('/users/:id', (req,res) => {
//     User.findOne({_id: req.params.id}).then((user) => {  //User.findById(req.params.id).then().catch()
//         if(!user) {
//             res.status(404).send();
//         }
//         res.send(user);
//     }).catch((e) => {
//         res.status(500).send();
//     })
// })

router.get('/users/:id', async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.params.id });
        res.send(user);
    }catch(e) {
        res.status(500).send(e)
    }
})


//UPDATING A RESOURCE
router.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'password', 'email']
    
    const isValidOperation = updates.every((update) => { //array  method takes callabck for each element, returns true if the condition passes for all elements , else returns false 
        return allowedUpdates.includes(update);
    }) 

    if(!isValidOperation){
        res.status(400).send("Only name, age, password and email can be updated")
    }

    try{
        const user = await User.findById(req.params.id);
        
        updates.forEach((update) => {
            user[update] = req.body[update]; //cannot use . notation, so use bracket notation-> dynamic 
        })

        await user.save(); //for user.save() method, middleware gets executed 

       //findbyidAndUpdate by-passes mongoose, so the middleware will not be called in this case, it directly operates on dB
       //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } ); //new option returns the 
       //updated record and not the original record and runValidators checks validation for the newly updated data
       if(!user){
           res.status(404).send();
       }   
       res.send(user)

    }catch(e){
        res.status(400).send(); 
    }
})


//DELETING A RESOURCE 

router.delete('/users/:id', async(req, res) => {
    try{
        const user = await  User.findByIdAndDelete(req.params.id);

        if(!user){
            res.status(404).send();
        }

        res.status(200).send(user);

    }catch(e){
        res.status(500).send(); 
    }
})


router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password); //findByCredentials not standard function, its defined on the schema 
        //so it can be used like calling on the model

        const token = await user.generateAuthToken();
        res.send({ user , token });
    }catch(e) {
        res.status(400).send(e);
    }
})



module.exports = router;
