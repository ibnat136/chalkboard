
if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const express= require('express')
const app= express()
const bcrypt= require('bcrypt')
const passport=require('passport')
const flash=require('express-flash')
const session=require('express-session')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 3002;
const mongoose = require('mongoose')
const User = require('./model/user');

const DBurl= 'mongodb+srv://mongo:jVooNwtFztcmAQTo@cluster0.ipmot.mongodb.net/chalkUser?retryWrites=true&w=majority';
mongoose.connect(DBurl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

.then((result) => {
  console.log('connected to db');
  app.listen(8080)})
.catch((err) => console.log(err))

// const initializePassport= require('./passport-config')
// initializePassport(passport, 
//     userEmail=> users.find(user=> user.userEmail==userEmail),
//     id=>users.find(user=> user.id==id)
// )

// const users=[]

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// app.use(passport.initialize())
// app.use(passport.session())
// app.use(methodOverride('_method'))

const { dirname } = require('path');
const path = require('path');
const { Mongoose } = require('mongoose')
const { isBigInt64Array } = require('util/types')

app.use(express.static(path.join(__dirname,'./static')))

app.get('/',(req,res)=>{
    res.render('page/index.ejs')
   
})

app.get('/student',(req,res)=>{
    res.render('page/studentPage.ejs')
})

// app.post('/', User.authenticate('local', {
//     successRedirect: '/student',
//     failureRedirect: '/',
//     failureFlash: true
//   }))


app.post('/',async(req,res)=>{
  res.json({status:'ok', data: 'COMING SOON'})

  const { userEmail, userPassword } = req.body
	const user = await User.findOne({ userEmail,userPassword }).lean()
 
})


  app.get('/signup', (req,res)=>{
    res.render('page/signup.ejs')
})
// checkNotAuthenticated,
app.post('/signup', async(req,res)=>{
  
  const{name,userEmail, userPassword:plainTestPassword}=req.body
  const hashedPassword=await bcrypt.hash(req.body.userPassword,10)
    try{
        
        // users.push
        const info= await User.create({
        // id: Date.now().toString(),
        name:name,
        email:userEmail,
        password:hashedPassword,
      

        // school,
        // dob: req.body.dateToSend

        })
        // console.log(info)
        res.redirect('/')
        console.log('user created successful: ', info)
        
    }catch(error){
      console.log(error)
      return res.json({status:'error', error})
      res.redirect('/signup')

    }
    

})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
  })

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next()
//     }
  
//     res.redirect('/')
//   }

  // function checkNotAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return res.redirect('/student')
  //   }
  //   next()
  // }

app.listen(3002, () =>{
  console.log("App listening on port"+PORT);
});