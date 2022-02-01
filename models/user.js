var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	nowa: Number,
	username: String,
	password: String,
	passwordConf: String
}),
User = mongoose.model('jsons', userSchema);

module.exports = User;
