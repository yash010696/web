var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Franchise = require('./franchise');
var Area = require('./area');
var Role = require('./role');
var userSchema = new Schema({
    // id: {
    //     type: Number,
    //     unique: true,
    //     default: 1
    // },
    first_Name: {
        type: String,
        required: true
    },
    // last_Name: {
    //     type: String,
    //     required: true
    // },
    franchise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Franchise'
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {

                return validator.isEmail(value);

            },

            message: '{VALUE} is not a valid Email'

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
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_at: {
        type: Date
    },
    status: {
        type: Boolean
    },
    statee: {
        type: Boolean
    }
}, { collection: 'users' });

// userSchema.pre('save', function(next) {
//     var user = this;
//     if (this.isModified('password') || this.isNew) {
//         bcrypt.genSalt(10, function(err, salt) {
//             if (err) {
//                 return next(err);
//             }
//             bcrypt.hash(user.password, salt, null, function(err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//                 user.password = hash;
//                 console.log(user.password)
//                 console.log("SAVED======================================== ", next());
//                 //next();
//             });
//         });
//     } else {
//         return next();
//     }
// });

// userSchema.methods.comparePassword = function(passw, cb) {
//     bcrypt.compare(passw, this.password, function(err, isMatch) {
//         if (err) {
//             return cb(err);
//         }
//         cb(null, isMatch);
//     });
// };

module.exports = mongoose.model('User', userSchema);