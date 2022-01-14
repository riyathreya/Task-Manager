require('../src/db/mongoose');

const User = require('../src/models/user');

//61b0dd9d9f4eea39307c072e

// User.findByIdAndUpdate('61b0dc51aafe6c19c86e85f0', { age: 1}).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1})
// }).then((count) => {
//     console.log(count);
// }).catch((e) => {
//     console.log(e);
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });

    return count;  // await gets a promise which is returned 

}

updateAgeAndCount('61b0dc51aafe6c19c86e85f0', 2).then((count) => {  // so wheer the async fcn is called, we can use .then and .catch
    console.log("result", count);
}).catch((e) => {
    console.log("e " , e);
})