var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var server = app.listen(3002);
var io = require('socket.io')(server);

// main config

app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});


// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/chat');

// routes
require('./routes')(app);


var users_connected = [];
var room = '8a Room';


//**************************************
// XSS 
//**************************************
function stripTags(string){
  var newstring = string.replace(/(<([^>]+)>)/ig,"");
  return newstring;
}


//**************************************
// Reemplazos
//**************************************
var find = [":caca:", ":caquita:", ":chori:", ":chorizo:"];
var replace = ['<img src="images/caca.png" width="20"/>', '<img src="images/caca.png" width="20"/>', '<img src="images/chori.png" width="40"/>', '<img src="images/chori.png" width="40"/>'];


String.prototype.replaceWords = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;

}



//**************************************
// Soquetes
//**************************************
io.on('connection', function (socket) {
  //socket.set('color', getColor());
  var color = getColor();
  socket.client.color = color;

  socket.on('comment', function (data) {

        
    if(data.comment != '' && data.username != ''){
      
      var comment = stripTags(data.comment); 

      var newcomment = comment.replaceWords(find, replace);
      
      if(newcomment == '@bananaReload'){
         socket.emit('banana', 'banana');
         socket.broadcast.emit('banana', 'banana');
      }
      if(newcomment == '@delfin'){
         socket.emit('banana', 'delfin');
         socket.broadcast.emit('banana', 'delfin');
      }


      socket.emit('comment_to_me', {comment: newcomment, username: data.username, color: socket.client.color, time: getDate()});
      socket.broadcast.emit('comment_to', {comment: newcomment, username: data.username, color: socket.client.color, time: getDate()});
    }
     
  });

  socket.on('gif', function(data){
    io.in(room).emit('gif', {gif: data.gif, username: data.username});
  });

  socket.on('join_room', function(data){
    socket.join(room);
    var user_connected = {};
  
    user_connected.username = data.user;
    user_connected.id = socket.id;
    user_connected.color = socket.client.color;
    users_connected.push(user_connected);

    
   
    io.in(room).emit('users_to_me', {users: users_connected});
    socket.emit('room_joined');
    //socket.broadcast.emit('users_to', {users: users_connected});
  });

  socket.on('is_writting', function(data){
      socket.broadcast.emit('is_writting', {username: data.username});
  });

  socket.on('disconnect', function () {
   
    removeUser(users_connected, 'id', socket.id);
   
    socket.to(room).emit('users_to', {users: users_connected});
  });
});

function removeUser(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}


function getColor(){
    var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff1000', '#ff0010', '#00ff10'];
    var color =  colors[Math.floor(Math.random()*colors.length)];
    var usedColors = [];
    return color;
  }


function getDate(){
  var d = new Date(); // for now
  var hour = d.getHours();
  var minute = d.getMinutes(); 
  return hour+': '+minute;
}  