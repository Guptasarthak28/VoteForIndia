const express=require('express');
const router= express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware}= require('../jwt');
const Candidate= require('../models/candidate')
const checkAdminRole = async(userId) =>{
    try{
const user = await User.findById(userId);
 if(user.role ==='admin'){
    return true;
 }
    }catch(err){
return false;
    }

}
// POST route to add a candidate

router.post('/',jwtAuthMiddleware, async(req,res) =>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({error: 'User has no admin role'});
        
    const data = req.body;

    //Create a new candidate document using the mongoose model
    const newCandidate = new Candidate(data);

    //Save the response
    const response = await newCandidate.save();
    console.log('Data saved');
    res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Invalid server error'})
    }
})



router.put('/:candidateId',jwtAuthMiddleware, async(req,res) =>{
    try{

        if(!checkAdminRole(req.user.id))
            return res.status(403).json({error: 'User has no admin role'});

const candidateId = req.params.candidateId;
const updatedCandidateData = req.body;
const response = await Person.findByIdAndUpdate(personId, updatedCandidateData,{
    new: true, // Return the updated document
    runValidators: true
})

if(!response){
return res.status(404).json({error:'Person not found'});
}

console.log('data updated');
res.status(200).json(response);
    }
    catch(err){
console.error(err)
res.status(500).json({error: 'Internal server error'});
    }
})

router.delete('/:candidateId',jwtAuthMiddleware, async(req,res) =>{
    try{

        if(!checkAdminRole(req.user.id))
            return res.status(403).json({error: 'User has no admin role'});

const candidateId = req.params.candidateId;
const response = await Person.findByIdAndDelete(candidateId)

if(!response){
return res.status(404).json({error:'Person not found'});
}

console.log('candidate deleted');
res.status(200).json(response);
    }
    catch(err){
console.error(err)
res.status(500).json({error: 'Internal server error'});
    }
})

// Voting
router.post('/vote/:candidateId',jwtAuthMiddleware, async(req,res) =>{

    candidateId =req.params.candidateId;
    userId = req.user.id;
    try{
        const candidate = await Candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({message:'Candidate not found'});
        }

        const user = await User.findById(userId); 
        if(!user){
            return res.status(404).json({message:'Candidate not found'});
        }
        if(user.isVoted){
            res.status(400).json({message:'You have already voted'});
        }
        if(user.role =='admin'){
            res.status(403).json({message:'Admin is not allowed '});
        }

        candidates.votes.push({user: userId})
        candidate.voteCount++;
        await canddidate.save();

        user.isVoted= true
        await user.save();
        res.status(200).json({message:'Votes recorded successfully'});
    }
    catch(err){
        console.error(err)
res.status(500).json({error: 'Internal server error'});
    }
})

//vote count
router.get('/vote/count', async(req,res) =>{
    try{
const candidate = await Candidate.find().sort({voteCount:'desc'});
// Map the candidates to only return their name and voteCount
const voteRecord = candidate.map((data) =>{
return {
    party: data.party,
    count : data.voteCount
}
});
return res.status(200).json(voteRecord)    

}catch(err){

    }
})
module.exports = router;