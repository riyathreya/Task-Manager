const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer', '').trim();
        //console.log(token);
        const decoded = jwt.verify(token, 'thisismynewcourse')// at this point, we get the content we encoded { -id...}
        //find a user with this id who has a string token in tokens array whose value matches the header token 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
    
        if(!user){
            throw new Error();
        }
        else {
            req.user = user;
            req.token = token;
            next();
        }
    }catch(e){
        res.status(401).send({ error:"please authenticate"})
    }
}

module.exports = auth;