const express = require('express')
const app = express();
const path = require('path')

app.get('*',(req,res)=>{
    res.status(200).send('<h1>Tuhin Khan</h1>')

    }
)

module.exports = app