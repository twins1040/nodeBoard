const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const server = app.listen(3000, function(){
  console.log("Express server has started on port 3000");
  require('./models').sequelize.sync({force: true})
    .then(() => {
      console.log('DB sync');
    });
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Router
app.get('/', (req, res) => {
  res.render('index', {
    title: "MY HOME",
    length: 5
  });
});
app.use('/users', require('./api/user'));
