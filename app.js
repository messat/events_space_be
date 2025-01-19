const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get("/", (req,res) =>{
    res.status(200).send("Event Space Back-end Server")
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})