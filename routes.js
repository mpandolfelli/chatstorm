var passport = require('passport');
var Account = require('./models/account');
var HistoryM = require('./models/history');
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });



module.exports = function (app) {

  app.get('/', function (req, res) {
    HistoryM.find({}, function(err, histories) {
    
      res.render('app', { user : req.user, histories: histories});
         
    });
      
     
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.get('/app',  function(req, res) {

     
      HistoryM.find({}, function(err, histories) {


      res.render('app', { user : req.user, histories: histories});
         
      });
      
     
  });

  app.post('/api', function(req, res) {

    if(req.body.username != '' && req.body.title != '' && req.body.text != ''){
       var history = new HistoryM({username: req.body.username, title: req.body.title, text: req.body.text, likes: 0, fires: 0});

         history.save(function(err) {
            if(err) {
                console.log(err);
                res.status(400);
                res.send(err);
            }else{
              res.send(200); 
            }
            
        });
  
      }
   

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
      
  
    //  
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
    
      res.redirect('/');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });


  app.get('/api',  function(req, res) {
      HistoryM.find({}, function(err, histories) {
       
        return res.json({
          histories: histories
            });
         
         
      });
      
     
  });

  
 
};
