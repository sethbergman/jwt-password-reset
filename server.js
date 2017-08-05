"use strict";

var express = require("express"),
  app = express(),
  port = process.env.PORT || 5000,
  mongoose = require("mongoose"),
  Task = require("./api/models/todoListModel"),
  User = require("./api/models/userModel"),
  bodyParser = require("body-parser"),
  jsonwebtoken = require("jsonwebtoken");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/Tododb", { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.post('/auth/getToken/', (req, res) => {
    if (req.body.email == 'hello@test.com' && req.body.password == 'test') {
        res.status(200)
            .json({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciJ9.J6n4-v0I85zk9MkxBHroZ9ZPZEES-IKeul9ozxYnoZ8'});
    } else {
        res.sendStatus(403);
    }
});

app.get('/getData/', (req, res) => {
    let token = req.headers['authorization'];
    if (!token) {
        res.sendStatus(401);
    } else {
        try {
            let decoded = jwt.verify(token.replace('Bearer ', ''), 'secret-key');
            res.status(200)
                .json({data: 'Valid JWT found! This protected data was fetched from the server.'});
        } catch (e) {
            res.sendStatus(401);
        }
    }
})
var routes = require("./api/routes/todoListRoutes");
routes(app);

app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + " not found"
  });
});

const server = app.listen(process.env.PORT || 5000, function() {
  console.log("Server running at http://0.0.0.0:" + server.address().port);
});

module.exports = app;
