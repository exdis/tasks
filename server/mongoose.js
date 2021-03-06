var mongoose = require('mongoose');
var log = require('./log')(module);
var bcrypt = require('bcrypt-nodejs');

var connectUrl = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/';
mongoose.connect(connectUrl + 'time');
var db = mongoose.connection;

db.on('error', function (err) {
  log.error('connection error:', err.message);
});
db.once('open', function callback () {
  log.info('Connected to DB!');
});

var Schema = mongoose.Schema;

// Schemas
var Task = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  userid: { type: String, required: true },
  time: { type: String, required: true },
  pubDate: { type: Date, default: Date.now }
});

var TaskModel = mongoose.model('Task', Task);

module.exports.TaskModel = TaskModel;

var userSchema = mongoose.Schema({

  email        : String,
  password     : String,
  cost : { type: Number, default: 0 }

});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var UserModel = mongoose.model('User', userSchema);

module.exports.User = UserModel;
