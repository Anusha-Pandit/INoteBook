const express=require('express');
const User=require('../models/User');
const router = express.Router();
const {body, validationResult}=require('express-validator');

//create user using POST "/api/auth".......(does not require auth)
router.post('/',[
body('name','Enter a valid name').isLength({min:3}),
body('email','Enter a valid email').isEmail(),
body('password','Password must be alteast 5 characters').isLength({min:5}),

],(req,res)=>{
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(User => res.json(User))
    .catch(err => console.log(err));
    res.json({error:'Enter valid email',message: err.message})
})

module.exports=router