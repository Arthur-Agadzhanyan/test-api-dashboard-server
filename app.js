const express = require('express')
const app = express()
const config = require('config')
const mongoose  = require('mongoose')
const cors = require('cors')
const PORT = config.get("port") || 5000

app.use(express.json({extended: true}))
app.use('/api/auth',cors(),require('./routes/auth.routes.js'))
app.use('/api/get-api',cors(),require('./routes/apis.routes.js'))

async function startServer() {
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT,()=>console.log(`Server started on port: ${PORT}`))
    }catch(e){
        console.log(`Server Error: ${e.message}`)
        process.exit(1)
    }
}

startServer()