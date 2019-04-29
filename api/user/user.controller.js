var fs = require("fs");
function readUsers(callback){
  fs.readFile( __dirname + "/../data/users.json", 'utf8', function(err, data){
    console.log(data);
    callback(err, data);
  });
}

module.exports = function(app){
  app.get('/', function(req, res){
    res.render('index', {
      title: "MY HOME",
      length: 5
    });
  });
  app.get('/users', function(req, res){
    readUsers(function(err, data){
      console.log( data );
      res.end( data );
    });
  });
  app.post('/users', function(req, res){
    var result = {};
    var name = req.body["name"];
    var password = req.body["password"];

    if (!name || !password) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    readUsers(function(err, data){
      var new_id;
      var users = JSON.parse(data);
      var duplicated = function(o){
        if (!o.name) return false;
        return o.name === name;
      }

      // if name is duplicated, return error
      if (users.some(duplicated)) {
        result["success"] = 0;
        result["error"] = "duplicated";
        res.json(result);
        return;
      }

      // Generate new id
      new_id = users[users.length-1].id + 1;
      console.log( new_id );

      // Add data to users object
      users.push({
        id: new_id,
        name: name,
        pasword: password
      });

      fs.writeFile(__dirname + "/../data/users.json",
        JSON.stringify(users, null, '\t'), "utf8", function(err, data){
          result = {"success": 1};
          res.json(result);
        }
      );
    });
  });
  app.get('/users/:id', function(req, res){
    readUsers(function(err, data){
      var users = JSON.parse(data);
      var req_id = Number(req.params.id);
      var user = users.filter(function(o){
        if (!o.id) return false;
        return o.id === req_id;
      });
      res.json(user);
    });
  });
}
