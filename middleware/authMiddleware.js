const jwt = require('jsonwebtoken');
const User = require('../models/User');


//Check if user is logged in or not
const requireAuth = (req,res,next) => {
      const token = req.cookies.jwt;
      if(token){
           jwt.verify(token,'net ninja secret',(err,decodedToken)=> {
              if(err){
                res.redirect('/login');
              }
              else{
              next();
              }
           });
      }
      else{
          res.redirect('/login');
      }
}

//find user details
const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
         jwt.verify(token,'net ninja secret',async (err,decodedToken)=> {
            if(err){
                res.locals.user = null;
              next();
            }
            else{
             let user = await  User.findById(decodedToken.id);  
             res.locals.user = user;
            next();
            }
         });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth,checkUser};