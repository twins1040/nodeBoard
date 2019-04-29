const fs = require("fs");
const USERDATA_PATH = __dirname + "/../../data/users.json";
const readUsers = function(callback){
  fs.readFile( USERDATA_PATH, 'utf8', (err, data) => {
    callback(err, data);
  });
};

module.exports = {
  list(req, res){
    readUsers((err, data) => {
      const users = JSON.parse(data);
      res.json(users);
    });
  },
  create(req, res){
    const name = req.body["name"];
    const password = req.body["password"];

    if (!name || !password) {
      return res.status(400).json({error: 'invalid data'});
    }

    readUsers((err, data) => {
      let new_id;
      let newUser;
      const users = JSON.parse(data);
      const duplicated = (o) => {
        if (!o.name) return false;
        return o.name === name;
      }

      // if name is duplicated, return error
      if (users.some(duplicated)) {
        return res.status(400).json({error: 'duplicated'});
      }

      // Generate new id
      new_id = users.reduce((max, user) => {
        return user.id > max ? user.id : max;
      }, 0) + 1;
      console.log( new_id );

      // Add data to users object
      newUser = {
        id: new_id,
        name: name,
        pasword: password
      }

      users.push(newUser);

      fs.writeFile(USERDATA_PATH,
        JSON.stringify(users, null, '\t'), "utf8", (err, data) => {
          res.json(newUser);
        }
      );
    });
  },
  retrieve(req, res){
    readUsers((err, data) => {
      const users = JSON.parse(data);
      const req_id = Number(req.params.id);
      const user = users.filter(u => u.id === req_id)[0];
      if (!req_id || !user) {
        return res.status(404).json({error: 'invalid id'});
      }
      res.json(user);
    });
  }
}
