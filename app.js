var express = require("express");
var app = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');
var ejs = require('ejs');
var server = app.listen(3000);
var io = require('socket.io')(server);


var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(expressSession({
        secret: 'apalapapa',
        name: 'hash',
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));


var users = [];
var user = {};



// Connection to DB
mongoose.connect('mongodb://localhost/users', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('public/js'));
app.use(express.static('public/images'));
app.use("/public", express.static((__dirname, 'public')));
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var models     = require('./models/user')(app, mongoose);
var UserCtrl = require('./controllers/users');

// Example Route

var router = express.Router();
router.get('/', function(req, res) {
  //res.send("Hello world!");
  console.log(req.session);
  if(req.session.username){
    res.render('index', { user: req.user });
  }else{
    
    res.render('welcome');
  }
  
});


router.get('/register', function(req, res) {
  //res.send("Hello world!");
  res.render('register');
});

router.get('/login', function(req, res) {
  //res.send("Hello world!");
  res.render('login');
});


app.use(router);



// API routes
var users = express.Router();

users.route('/users')
  .get(UserCtrl.findAllUsers)
  .post(UserCtrl.addUser);


users.route('/users/:username/:userpass')
  .get(UserCtrl.findOne)
  .put(UserCtrl.updateUser)
  .delete(UserCtrl.deleteUser);

app.use('/api', users);

// Start server



io.on('connection', function (socket) {

  socket.on('comment', function (data) {
    if(data.comment != '' && data.username != ''){
      socket.emit('comment_to_me', {comment: data.comment, username: data.username});
      socket.broadcast.emit('comment_to', {comment: data.comment, username: data.username});
    }
     
  });
});