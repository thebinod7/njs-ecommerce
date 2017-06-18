const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const objectId = mongoose.Schema.ObjectId;
const userSchema = mongoose.Schema({
    userId : objectId,
    profilePicUrl : {
        type : String
    },
    firstName : {
        type: String,
        required : true
    },
    lastName : {
        type : String
    },
    phone : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    Address : {
        type : String
    },
    isActive : {
        type : Boolean,
        default : true
    },
    dateAdded : {
        type : Date,
        default: Date.now
    },
    newPassword : {
        type : String
    }
});

const Users = module.exports = mongoose.model('Users',userSchema);

module.exports.getUserByEmail = function (email, callback) {
    const query = {email : email}
    Users.findOne(query,callback);
}

module.exports.addUser = function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (candidatePassword,hash,callback) {
    bcrypt.compare(candidatePassword,hash,function (err,isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}

module.exports.changePassword = function (user_data,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user_data.newPassword, salt, function(err, hash) {
            if (err) throw err;
            user_data.newPassword = hash;
            callback(null,user_data);
        });
    });
}
