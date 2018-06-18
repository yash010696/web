var mongoose = require('mongoose');
const validator =require('validator');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var admininfoSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim:true,
  },
  lastname: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type:String,
    required:true,
    unique: true,
    trim:true,
    validate:{
      validator: (value)=>{
        return validator.isEmail(value);  
      },
      message:'{VALUE} is not a valid Email'
 }
  },
  mobile: {
    type: String,
    required: true
   
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim:true
    
  }, 
  password: {
    type: String,
    required: true,
    minlength:6
  }
}, { collection: 'logins' });

admininfoSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, function (err, salt) {
          if (err) {
              return next(err);
          }
          bcrypt.hash(user.password, salt, null, function (err, hash) {
              if (err) {
                  return next(err);
              }
              user.password = hash;
              console.log("SAVED======================================== ", next());
              //next();
          });
      });0
  } else {
      return next();
  }
});

admininfoSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};



module.exports = mongoose.model('Admininfo', admininfoSchema);

