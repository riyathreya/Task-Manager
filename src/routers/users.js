const express = require('express');

const router = express.Router();
const User = require('../models/user');  //model is required in the routers
const auth = require('../middleware/auth');

//using async await

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token }); 
    }catch(e){
        res.status(400).send(e)
    }
          
});

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password); //findByCredentials not standard function, its defined on the schema 
        //so it can be used like calling on the model

        const token = await user.generateAuthToken();
        res.send({ user, token });
    }catch(e) {
        res.status(400).send(e);
    }
})

//wipe one token used for current logon
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens  = req.user.tokens.filter((token) => token.token !== req.token) //that particular token used for logging for this logout is removed
        req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})

//wipe all existing tokens
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})


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


//UPDATING A RESOURCE
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'password', 'email']
    
    const isValidOperation = updates.every((update) => { //array  method takes callabck for each element, returns true if the condition passes for all elements , else returns false 
        return allowedUpdates.includes(update);
    }) 

    if(!isValidOperation){
        res.status(400).send("Only name, age, password and email can be updated")
    }

    try{
        //const user = await User.findById(req.params.id);
        
        updates.forEach((update) => {
            req.user[update] = req.body[update]; //cannot use . notation, so use bracket notation-> dynamic 
        })

        await req.user.save(); //for user.save() method, middleware gets executed 

       //findbyidAndUpdate by-passes mongoose, so the middleware will not be called in this case, it directly operates on dB
       //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } ); //new option returns the 
       //updated record and not the original record and runValidators checks validation for the newly updated data
        
       res.send(req.user)

    }catch(e){
        res.status(400).send(); 
    }
})


//DELETING your user profile 

router.delete('/users/me', auth, async (req, res) => {
    try{
        // const user = await  User.findByIdAndDelete(req.user._id); //auth middleware has added user and token to request

        // if(!user){
        //     res.status(404).send();
        // }
        await req.user.remove();
        res.status(200).send(req.user);

    }catch(e){
        res.status(500).send(); 
    }
})




module.exports = router;


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




// //get all resources 
// router.get('/users', (req,res) => {
//     User.find({}).then((users) => {
//         res.send(users)
//     }).catch((e) => {
//         res.status(500).send();
//     })                             //Not specifying anything within brackets fetches all records from the collection
// })



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
