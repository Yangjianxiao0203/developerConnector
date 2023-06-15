const mongoose=require('mongoose');

const ProfileSchema = new mongoose.Schema({
    // user 字段： 有一个id，是mongodb中的id，还有一个ref，关联到对应的user Id
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user' // 关联到数据库的user模型(user表):collection SQL中叫table
    },
    company: {
        type:String
    },
    website: {
        type:String
    },
    location: {
        type:String
    },
    status: {
        type:String,
        required:true
    },
    skills: {
        type:[String],
        required:true
    },
    bio: {
        type:String
    },
    githubusername: {
        type:String
    },
    date: {
        type:Date,
    },
    experience: [
        {
            title: {
                type:String,
                required:true
            },
            company: {
                type:String,
                required:true
            },
            location: {
                type:String
            },
            from: {
                type:Date,
                required:true
            },
            to: {
                type:Date
            },
            current: {
                type:Boolean,
                default:false
            },
            description: {
                type:String
            }
        }
    ],
    education: [
        {
            school: {
                type:String,
                required:true
            },
            degree: {
                type:String,
                required:true
            },
            fieldofstudy: {
                type:String,
                required:true
            },
            from: {
                type:Date,
                required:true
            },
            to: {
                type:Date
            },
            current: {
                type:Boolean,
                default:false
            },
            description: {
                type:String
            }
        }
    ],
    social: {
        youtube: {
            type:String
        },
        twitter: {
            type:String
        },
        facebook: {
            type:String
        },
        linkedin: {
            type:String
        },
        instagram: {
            type:String
        }
    },
})

let Profile = mongoose.model('profile', ProfileSchema);
module.exports = Profile;