const express=require('express');
const app=express();

const PORT=process.env.PORT || 5001; // if deployed use the port provided by the host else use 5000

//for test 
app.get('/',(req,res)=>{
    res.send("API running");
})

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
});