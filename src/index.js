const express = require('express');

require('./db/mongoose'); //by adding require, it ensures that  the file runs 
//const {ObjectId}= require('mongoose);')

const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express();

const port = process.env.PORT || 3000;

//middleware for parsing JSON
app.use(express.json());
app.use(userRouter);
app.use(taskRouter)

app.listen(port, () => {
    console.log("server is up on port "+ port)
}); 


//without middleware --> new request --> handler 
//with middleware --> new request --> do something --> go to handler or not based on next() call


//register a new middleware 
// app.use ((req, res, next) => {

//     console.log(req.method, req.path);
//     if(req.method === 'GET') {
//             next(); 
//     }//specific to registering middleware 
//     else {
//         res.send("not working, only GET method supported ");
//     }
// })

// //setting the server under maintenance, all requests returned with status 503 - service unavailable 
// app.use((req, res, next) => {
//     res.status(503).send("Under maintainence!")
// })



//BASIC BCRYPT FUNCTION FOR HASH, COMPARE 
//const bcrypt = require('bcrypt');

// const myFunction = async() => {
//     const password = 'Red12345!';
//     const hashedPassword = await bcrypt.hash(password, 8) //password to be hashed, no of times hash should be performed 

//     console.log(password, hashedPassword)//Red12345! $2b$08$LhZre3kmH2BbE.TLIIZI1O10pF2TpMFFjhDuAmcNlUYzRMyAEbHbq

//     const isMatch = await bcrypt.compare('Red12345!', hashedPassword);//compare the hashed password and user entered password 

//     console.log(isMatch)

//     //hashing alogirthms 
//     // --> password --> hashed password (cannot be reversed) (one way algorithms)

//     //encryption alogirthms 
//     // --> password  --> encrypted password --> (decrypt) password 

// }

// myFunction();

// //BASIC JWT FUNCTION FOR SIGN, VERIFY
// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//     let token = await jwt.sign({ _id: '12345' }, 'thisisjusttosign', { expiresIn: '7 days'}); //1st argument: unique id to be encrypted,2nd argument  signature used to encrypt, 3rd argument options for json token expiration
//     console.log(token)

//     const data = await jwt.verify(token, 'thisisjusttosign' );
//     console.log(data)

// }
// myFunction();


//JSON.stingify and toJSON

// if we call JSON.stringify on an object and that object already has a function toJSON defined on it,
//then it implicity overwrites the JSON.stringify and toJSON function is executed
//in example below, instead of printing the entire prt object in line 30, it will print only pet name because 
//only pet name is returned in function toJSOn on line 28



// const pet = {
//     name: 'jimmy'
// }

// pet.toJSON = function(){
//     return this.name
// }


// console.log(JSON.stringify(pet));


const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('61e80701f4ed444a9c894bd2');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner) //this will print the entire user object instead of the user ID  stored in DB

    const user = await  User.findById('61e806f8f4ed444a9c894bd0');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks); 


}

main()



