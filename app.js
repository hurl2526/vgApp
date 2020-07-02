const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/Users/userRoutes');
const gamesRouter = require('./routes/Games/gameRoutes');
const Game = require('./Games/models/Game')
const User = require('./Users/models/User');

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(`MongoDB Error: ${err}`))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//Making sure the user can view certain pages only if they are logged in----
const auth = (req,res,next)=>{
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/no')
  }
}

const loginCheck=[
  check('email').isEmail(),
  check('password').isLength({min:3})
]


app.get('/games',auth,(req,res)=>{
  Game.find().then((gameData) => 
  // console.log(movieData))
  res.render('games',{gameData}))
.catch(error => console.log(error))
});



app.get('/no', (req, res) => {
  res.render('no')
})

app.get('/games',auth, (req, res) => {
    res.render('games')
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success', 'you are now logged out')
  res.redirect('/login')
})

const loginValidate = (req,res,next)=>{
  const info = validationResult(req);
  if(!info.isEmpty()){
    req.flash('errors','Invalid email or Password')
    return res.redirect('/login')
  }
  next();
};
const registerValidate = (req,res,next)=>{
  const info = validationResult(req);
  if(!info.isEmpty()){
    req.flash('errors','Invalid email or Password')
    return res.redirect('/register')
  }
  next();
};

app.post('/login',loginCheck,loginValidate,passport.authenticate('local-login',{
  successRedirect:'/games',
  failureRedirect:'/login',
  failureFlash:true
}))


app.post('/register',loginCheck,registerValidate, (req, res) => {
  User.findOne({ email: req.body.email })
  .then((user) => {
    if (user) {
      // return res.status(400).json({ message: 'User Exists' });
      req.flash('errors', 'account exists');
      return res.redirect(301,'/register');
    }else{

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    let newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = hash;

    newUser.save().then((user) => {
        req.login(user,(err)=>{
          if(err){
            res.status(500).json({confirmation:false,message:"server Error"})
          } else{
            return res.redirect('/games')
          }
        })
      })
      .catch((err)=>console.log('error here'))
      }
  })
})

module.exports = app;
