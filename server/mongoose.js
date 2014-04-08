var mongoose = require('mongoose');
var log = require('./log')(module);
var bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost/exdisme');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas
var Post = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    pubDate: { type: Date, default: Date.now },
    modDate: { type: Date, default: Date.now }
});

var PostModel = mongoose.model('Post', Post);

module.exports.PostModel = PostModel;

var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    }

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var UserModel = mongoose.model('User', userSchema);

module.exports.User = UserModel;