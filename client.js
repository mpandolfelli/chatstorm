var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var server = app.listen(3003);
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


// mongoose
mongoose.connect('mongodb://localhost/chat');

// routes
require('./clientroutes')(app);


var users_connected = [];
var room = '8a Room';
var colors = ['#ff0000', '#00ff00', '#008080', '#ffff00', '#800000', '#00ffff', '#ff00ff', '#00ffff', '#ff1000', '#c0c0c0', '#ff0010', '#00ff10', '#BA68C8', '#80CBC4', '#CDDC39', '#A1887F'];

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
   
    var color =  colors[Math.floor(Math.random()*colors.length)];
    var index = colors.indexOf(color);
    if (index > -1) {
        colors.splice(index, 1);
    }
    return color;
  }


function getDate(){
  var d = new Date(); // for now
  var hour = d.getHours() - 3;
  var minute = d.getMinutes(); 
  return hour+': '+minute;
}  