const express = require('express');

require('./db/mongoose'); //by adding require, it ensures that  the file runs 
//const {ObjectId}= require('mongoose);')

const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express();

const port = process.env.PORT || 3000;

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


//middleware for parsing JSON
app.use(express.json());
app.use(userRouter);
app.use(taskRouter)


app.listen(port, () => {
    console.log("server is up on port "+ port)
});

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