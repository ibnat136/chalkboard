
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require ('path');

const express= require('express')
const app= express()


const { dirname } = require('path');
const path = require('path');


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname + '/views'));
app.set('layout', 'layouts/layouts')
app.use(expressLayouts)
app.use(express.static('public'))

app.use(express.static(path.join(__dirname,'./static')))


app.get('/',(req,res)=>{
    res.render('page/index.ejs')
})

app.get('/signup',(req,res)=>{
    res.render('page/signup.ejs')
})
app.listen(3002);