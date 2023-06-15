const express=require('express');
const auth=require('../../middleware/auth');
const router=express.Router();
const {check, validationResult}= require('express-validator');

const Profile=require('../../models/Profile');
const User=require('../../models/User');

// @route   GET api/profiles
// @desc    get all profiles
// @access  Public
router.get('/',async (req,res)=>{ 
    try {
        const profiles= await Profile.find().populate('user',['name','avatar']);
        res.status(200).json(profiles);
    } catch(err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profiles/me
// @desc    get my profile, auth to decode the encryted id
// @access  Private
router.get('/me',auth,async (req,res)=>{ 
    try {
        const profile = await Profile.findOne({user:req.user.id})
                        .populate('user',['name','avatar']) // populate 关联： 将查询到的Profile 与其关联的user表的name和avatar合并
        if(!profile) {

            return res.status(400).json({msg:"you don't have any profile"});
        }
        
        res.json(profile)

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profiles
// @desc    create or update a profile
// @Params: a json file in header 
// @access  Private : need token in header, the id in user collections
router.post('/',[
        auth,
        check('status','Status is required').not().isEmpty(),
        check('skills','Skills is required').not().isEmpty(),
    ], async (req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()) {return res.status(400).json({errors:errors.array()})}

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        }=req.body;

        // Build profile object
        const profileFields={};
        profileFields.user=req.user.id;
        if(company) {profileFields.company=company};
        if(website) {profileFields.website=website};
        if(location) {profileFields.location=location};
        if(bio) {profileFields.bio=bio};
        if(status) {profileFields.status=status};
        if(githubusername) {profileFields.githubusername=githubusername};
        profileFields.date=Date.now();
        if(skills) {
            //split the string into array, and trim the space
            profileFields.skills=skills.split(',').map(skill=>skill.trim());
        }

        // Build social object
        profileFields.social={};
        if(youtube) {profileFields.social.youtube=youtube};
        if(twitter) {profileFields.social.twitter=twitter};
        if(facebook) {profileFields.social.facebook=facebook};
        if(linkedin) {profileFields.social.linkedin=linkedin};
        if(instagram) {profileFields.social.instagram=instagram};

        // see if the profile already exist
        try {
            let profile = await Profile.findOne({user:req.user.id})
            if(!profile) {
                // not exist
                profile=new Profile(profileFields)
                await profile.save()
            } else {
                profile=await Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set:profileFields}, //将 profileFields 对象中的字段值更新到匹配的文档中
                    {new:true} //返回更新后的文档
                );
            }
            return res.status(200).json(profile)
        } catch(err) {
            res.status(500).send('Server Error' + err.message);
        }

})

// @route   GET api/profiles/user/:user_id
// @desc    get profile by user id
// @access  Public 
router.get('/user/:user_id',async (req,res)=>{ 
    try {
        const profile= await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) {return res.status(400).json({msg:"Profile not found"})}
        res.status(200).json(profile);
    } catch(err) {
        res.status(500).send('Server Error: '+err.message);
    }
});

// @route   DELETE api/profiles/
// @desc    delete profile, user and posts
// @access  Private: by token
router.delete('/',auth,async (req,res)=>{
    try {
    //Profile 中有user属性，User中有_id属性
        await Profile.findOneAndDelete({user: req.user.id});
        await User.findOneAndDelete({_id: req.user.id});
        return res.status(200).json({msg:"User deleted"});
    } catch(err) {
        res.status(500).send('Server Error: '+err.message);
    }
})

module.exports=router;