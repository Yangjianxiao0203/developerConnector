const express=require('express');
const connectDB=require('./config/db');
const app=express();

const PORT=process.env.PORT || 5001; // if deployed use the port provided by the host else use 5000

//Connect Database
connectDB();

//Init Middleware
/*
app.use() 函数用于将 express.json() 中间件函数应用到 Express 应用程序的所有路由中。
这意味着在处理请求之前，该中间件会解析请求的主体，并将其转换为 JSON 格式，然后将其作为 req.body 对象的属性添加到请求对象中。
*/
app.use(express.json({extended:false}));

//for test 
app.get('/',(req,res)=>{
    res.send("API running");
})

//Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profiles',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
});