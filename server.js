const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./app')
mongoose.connect(process.env.DB_CONNECTION).then(()=>console.log('connected successfully'))

app.listen(3000,()=>{
    console.log(`Listen on port 3000 ... `)
})