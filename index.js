require('dotenv').config()

const express = require('express');
const router = require('./routes');
const connectToDB = require('./connectToDB');
const app = express();

const PORT = 3000

app.use(express.json());
app.get('/', (req, res) => {
    res.send("<h1>Hello, world!</h1>")
})

app.use('/api/v1', router)
// app.listen(PORT, () => console.log(`Server startered on port ${PORT}`));

const start = async () => {
    
    await connectToDB()    
    // console.log(process.env.DB_NAME)
    app.listen(PORT, () => console.log(`Server startered on port ${PORT}`));
  
}

start()