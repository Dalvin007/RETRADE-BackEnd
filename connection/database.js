const mongoose=require('mongoose')

mongoose.connect("mongodb+srv://dalvintdavi:dalvin123@reatradeog.8kv7v.mongodb.net/RetradeDB?retryWrites=true&w=majority&appName=reatradeog")
.then(()=>{console.log("DB connected")})
.catch(err=>console.log(err));
