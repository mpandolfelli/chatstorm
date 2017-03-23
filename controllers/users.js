//File: controllers/users.js
var mongoose = require('mongoose');
var User  = mongoose.model('User');

//GET - Return all users in the DB
exports.findAllUsers = function(req, res) {
	/*User.find(function(err, users) {
    if(err) res.send(500, err.message);

    console.log('GET /users')
		res.status(200).jsonp(users);
	});*/
	res.send(500, 'Que buscás aca bebote?');
};

//GET - Return a user with specified ID
exports.findById = function(req, res) {
	User.findById(req.params.id, function(err, user) {
    if(err) return res.send(500, err.message);

    console.log('GET /user/' + req.params.id);
		res.status(200).jsonp(user);
	});
};

exports.findOne = function(req, res) {
	

	User.findOne({username: req.params.username}, 'username userpass', function(err, user) {
		console.log(user);
	  	if(user){
	  		console.log('pass '+req.params.userpass);

	  		if(user.userpass == req.params.userpass){
	  			console.log('apalapapa');
	  			req.session.username = user.username;
	  			
				res.status(200).jsonp(user);
	  			


	  		}else{
    			return res.send(500, 'user not found');
    		}

	    	//console.log('GET /user/' + req.params.username);
			//res.status(200).jsonp(user);
			
			
		

    	}else{
    		return res.send(500, 'user not found');
    	}
	});
	
	
};


//GET - Return a user with specified ID
exports.findByName = function(req, res) {
	User.findByName(req.params.username, function(err, user) {
    if(err){
    	return res.send(500, err.message);
    } else{

    	//console.log('GET /user/' + req.params.username);
		//res.status(200).jsonp(user);
		console.log('apalapapa');
		var randomNumber=Math.random().toString();
	    randomNumber=randomNumber.substring(2,randomNumber.length);
	    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });

    }

  

	});
};


//POST - Insert a new user in the DB
exports.addUser = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var user = new User({
		username:    req.body.username,
		userpass: 	  req.body.userpass
		
	});

	user.save(function(err, user) {
		if(err) return res.send(500, err.message);
   		 res.status(200).jsonp(user);
  
	});
};

//PUT - Update a register already exists
exports.updateUser = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		user.username   = req.body.username;
		user.pass    = req.body.pass;
		

		user.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(user);
		});
	});
};

//DELETE - Delete a user with specified ID
exports.deleteUser = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		user.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200);
		})
	});



};
