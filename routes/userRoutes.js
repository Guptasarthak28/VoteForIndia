const express=require('express');
const router= express.Router();
const User= require('./../models/user')
const {jwtAuthMiddleware, generateToken}= require('./../jwt');

//POST route to add a person
router.post('/signup', async(req,res) =>{
    try{
const data = req.body; // Assuming the request body contains the person data

//Create a new user document using the mongoose model
const newuser= new User(data);

// Save the new user to the database
const response = await newuser.save();
console.log('data saved')
const payload = {
    id: response.id
}
console.log(JSON.stringify(payload));
const token = generateToken(payload);
console.log("Token is", token);
res.status(200).json({response: response, token: token});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})

    }
})
//Login route
router.post('/login', async(req,res) =>{
    try{
        // Extract aadharnumber and password from request body
           const {aadharCardNumber, password} = req.body;

           // find the user by aadharcardnumber
           const user =await User.findOne({aadharCardNumber: aadharCardNumber});

           //if user does not exist or password does not match, throw error
           if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or password'})
           }

           //Generate token
           const payload ={
            id:user.id,

           }
           const token = generateToken(payload)

           // return token as response
           res.json({token})
        }
    catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});

    }
});

// Profile route
router.get('/profile',jwtAuthMiddleware, async(req,res) =>{
try{
    const userData = req.user;

const userId = userData.id;
const user = await User.findOne(userId);
res.status(200).json({user});
}
catch(err){
    console.error(err);
    res.status(500).json({error:'Internal server error'});
}
});

//GET method to get the person
router.put('/profile/password', async(req,res) =>{
    try{
const userId = req.user // extract the id from the token
const{currentPassword, newPassword}= req.body // Extract the current and new passwords from the request body

// Find the user by userId
const user = await User.findById(userId);

//if password does not match, throw error
if( !(await user.comparePassword(currentPassword))){
    return res.status(401).json({error:'Invalid username or password'});
   }

   //Update the user's password
   user.password = newPassword;
   await user.save()

   console.log('password updated');
   res.status(200).json({message:"Password Updated"});
    }
    catch(err){
console.error(err)
res.status(500).json({error: 'Internal server error'});
    }
})
module.exports = router;