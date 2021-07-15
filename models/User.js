const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    }
});
// --> Fire a function after saving data in the database
// userSchema.post('save',function(doc,next){
//      console.log('User was created and saved',doc);
//      next();
// });


// --> Fire a function before saving data in the database
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password =await bcrypt.hash(this.password,salt);
     next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

const User = mongoose.model('user',userSchema);  

module.exports = User