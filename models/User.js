const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    avatar: {
        type:String
    },
    data: {
        type:Date,
        default: Date.now
    }
})
/*
导出用户模型：使用 mongoose.model 方法将用户模式编译为实例模型，并将其导出。
mongoose.model 接受两个参数，第一个参数是模型的名称（'user'），用于在数据库中创建集合，第二个参数是定义的用户模式（UserSchema）。
*/
let User = mongoose.model('user', UserSchema);
module.exports = User;