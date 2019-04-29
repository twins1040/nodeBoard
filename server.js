var express = require('express');
var app = express();
var bindRouter = require('./router/main');
var bodyParser = require('body-parser');
var session = require('express-session');

var server = app.listen(3000, function(){
  console.log("Express server has started on port 3000");
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  secret: '!@#@$%^^&%$#@',
  resave: false,
  saveUninitialized: true
}));

bindRouter(app);
