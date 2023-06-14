const express=require('express');
const router=express.Router();
const gravatar = require('gravatar')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const config=require('config')
const { check, validationResult } = require('express-validator');

const User = require('../../models/User')

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/',(req,res)=>{ 
    console.log(req.body);

    res.send("User route")
});

// @route   POST api/users
// @desc    register user
// @access  Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more charactors').isLength({min:6})
],async (req,res)=>{ 
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    const {name,password,email}=req.body;

    try{
    // See if user exists : if exist return 400
    let user=await User.findOne({email:email});

    if(user) {
        return res.status(400).json({ errors: [{msg: "User already exist"}]});
    }

    // Get users gravatar
    const avatar=gravatar.url(email,{
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    })

    // Encrypt password
    /*
    生成 salt：首先，通过调用 bcrypt.genSalt(10) 生成一个 salt。Salt 是一个随机生成的字符串，用于增加密码哈希的安全性。10 是 salt 的计算成本，表示生成 salt 所需的计算工作量，值越高，计算成本越大，哈希的强度越高。
    加密密码：接下来，使用生成的 salt 对密码进行哈希加密。bcrypt.hash(password, salt) 方法用于对给定的密码进行哈希操作，其中 password 是要加密的密码，salt 是生成的 salt。
    salt：用于增加哈希强度的 salt。
    bcrypt.hash() 方法会将密码与 salt 结合起来，并使用 bcrypt 哈希算法生成一个安全的哈希值。生成的哈希值是不可逆的，无法从哈希值还原出原始密码。
    更新用户密码：将加密后的密码赋值给用户对象的 password 字段，以便存储在数据库中。这样，在用户进行登录或密码验证时，可以将提供的密码与数据库中的哈希密码进行比较。
    save() 方法是 Mongoose 模型实例的方法，用于将该实例的数据保存到 MongoDB 中对应的集合中。在这种情况下，user 是一个 Mongoose 用户模型的实例，通过调用 save() 方法，该用户对象会被保存到数据库中
    */
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken

    //对于jwt加密，payload就像body一样，意思是 jwt 解码后会变成
    /*
    {
        "user": {
            "id": "用户的唯一标识符或用户 ID"
        }
    }
    */
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