const express = require('express')

const app  = express()

app.use("/hello" , (req , res) => {
    res.send("hello world");
})

app.use("/" , (req , res) => {
    res.send('YOYOYO 148')
})

const PORT = 3000;

app.listen(PORT , () => {
    console.log(`Server on http://localhost:${PORT}`);
})