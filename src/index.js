const app = require('./app')
const port = process.env.PORT
app.listen(port, ()=>{
    console.log('server up at port '+ process.env.PORT)
})