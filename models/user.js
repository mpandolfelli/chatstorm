exports = module.exports = function(app, mongoose) {

	var userSchema = new mongoose.Schema({
		username: 		{ type: String },
		userpass: 		{ type: String }
		
	});

	mongoose.model('User', userSchema);

};

