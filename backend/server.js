const express= require('express')
const app= express()

const { dirname } = require('path');
const path = require('path');

app.use(express.static(path.join(__dirname,'./static')))

app.get('/',(req,res)=>{
    res.render('page/index.ejs')
})

app.get('/signup',(req,res)=>{
    res.render('page/signup.ejs')
})
app.listen(3002)