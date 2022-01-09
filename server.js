const express = require('express')

const cors = require('cors')
const app = express()
const port = 8991

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    //res.json({requestBody: req.body})
    console.log(req.body);
    res.send('Register')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})