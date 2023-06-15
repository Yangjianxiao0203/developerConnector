const express=require('express');
const router=express.Router();
const auth = require('../../middleware/auth');
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const config=require('config')
const { check, validationResult } = require('express-validator');

const User=require('../../models/User');

// @route   GET api/auth
// @desc    auth verify
// @access  Private 
router.get('/',auth, async (req,res)=>{ 
    try {
        // get user from database by id, leave off the password
        //req.user.id 是由user中的payload定义的
        const user= await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
});

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/',(req,res)=>{ 
    console.log(req.body);

    res.send("User route")
});

// @route   POST api/users
// @desc    authenticate user && get token
// @access  Public
router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
],async (req,res)=>{ 
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    const {password,email}=req.body;

    try{
    // See if user doesn't exist : if not exist return 400
    let user=await User.findOne({email:email});

    if(!user) {
        return res.status(400).json({ errors: [{msg: "Invalid Credentials"}]});
    }

    // ensure password matched: input from frontend : user.password(backend)
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch) {
        return res.status(400).json({ errors: [{msg: "Invalid Credentials (password wrong)"}]});
    }

    const payload = {
        user: {
            id:user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtToken'),
        {expiresIn:36000},
        (err,token)=>{
            if(err) {throw err;}
            res.json({token});
        }
    );

    } catch(err) {
        console.log(err.message);
        res.status(500).send('server error')
    }

});



module.exports=router;