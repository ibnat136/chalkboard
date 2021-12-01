
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002;
const expressLayouts = require('express-ejs-layouts')

const { dirname } = require('path');
const path = require('path');


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname + '/views'));
app.set('layout', 'layouts/layouts')
app.use(expressLayouts)
app.use(express.static('public'))

// const mongoose = require('mongoose')
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
// const db = mongoose.connection
// db.on('error', error => console.error(error))
// db.once('open', () => console.log('Connected to Mongoose'))




app.use(express.static(path.join(__dirname,'./static')))


app.get('/',(req,res)=>{
    res.render('page/index.ejs')
})

app.get('/signup',(req,res)=>{
    res.render('page/signup.ejs')
})
app.listen(3002, () =>{
    console.log('App listening on port 3002');
});