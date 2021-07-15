const express = require('express');
const mongoose = require('mongoose');
const authRoutes= require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect('mongodb://localhost/node-auth', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
   .then((result) => app.listen(PORT, () => console.log(`Listening on PORT ${PORT}...`)))
   .catch((err) => console.log(err));


// routes
app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use('/',authRoutes);
app.get('*',(req,res) => res.send('Page not found'))

app.get('/set-cookie',(req,res) => {
    res.cookie('username',true,{httpOnly : true,maxAge : 1000*24*60*60});
    res.send('Cookies send');
});

app.get('/read-cookie',(req,res) => {
    const cookies = req.cookies;
    res.json(cookies);
})