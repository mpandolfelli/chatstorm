var passport = require('passport');
var Account = require('./models/account');
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });


module.exports = function (app) {

  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.post('/register', function(req, res) {
     //upload.single('avatar');
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
       
       
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
    });
  });

  app.get('/login', function(req, res) {
      
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
     
      res.redirect('/');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

 
};