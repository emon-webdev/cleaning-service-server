
const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors())
app.use(express.json())

const Port = process.env.PORT || 5000;



app.get('/', (req, res) => {
    res.send('Cleaning Service is Running')
})







app.listen(Port, () => {
    console.log(`Cleaning Service is Running  ${Port}`)
})

