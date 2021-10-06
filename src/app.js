const express = require('express')
const app = express();
const path = require('path')

app.get('*',(req,res)=>{
    res.status(404).send('Node server is on')

    }
)
module.exports = app