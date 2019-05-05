const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const paginate = require('express-paginate');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const root = require('./root');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(paginate.middleware(3, 3));

// Router
app.use('/users', require('./api/user'));
app.use('/posts', require('./api/post'));
app.use('/comments', require('./api/comment'));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Run server
const server = app.listen(3000, function(){
  console.log("Express server has started on port 3000");
  require('./models').sequelize.sync({force: false})
    .then(() => {
      console.log('DB sync');
    });
})
