const express = require('express')
const app = express();
const path = require('path')

app.get('*',(req,res)=>{
    res.status(200).send('<h1>NodeJs Live with aws codepipeline</h1>')

    }
)

module.exports = app