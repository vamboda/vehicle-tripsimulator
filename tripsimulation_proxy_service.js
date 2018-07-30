const port = 5000;

var express = require("express");
var SignalRJS = require("signalrjs");
const bodyParser = require("body-parser");
var cors = require("cors");

const newLocal = "./data/route.json";

var route = require(newLocal);

var signalR = SignalRJS();

var server = express();
var router = express.Router();

server.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

server.use(signalR.createListener());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/* serves main page */
server.get("/", function(req, res) {
  res.sendfile("index.htm");
});

let shuttle1LocationIndex = 0;
let shuttle2LocationIndex = 51;
let shuttle3LocationIndex = 21;

/* serves main page */
server.get("/vehiclelocation", function(req, res) {
  console.log("Current vehicle loc index:" + shuttle1LocationIndex);
  res.send(route[shuttle1LocationIndex++ % route.length]);
});

server.get("/vehicles", function(req, res) {
  /* some server side logic */
  res.sendfile("data/vehicles.json");
});

server.use("/", router);
console.log("Go to the link: http://localhost:" + port);

server.listen(port);

setInterval(function() {
  var shuttle1Id = "Shuttle_1";
  shuttle1LocationIndex += 15;
  var shuttle1GpsLocation = route[shuttle1LocationIndex % route.length];
  console.log(
    `Moving the ${shuttle1Id} to the ${JSON.stringify(shuttle1GpsLocation)}`
  );
  signalR.broadcast({
    Hub: "signalRNotificationHub",
    Method: "locationModified",
    Args: [shuttle1Id, shuttle1GpsLocation]
  });
}, 3359);

setInterval(function() {
  var shuttle2Id = "Shuttle_2";
  shuttle2LocationIndex += 13;
  var shuttle2GpsLocation = route[shuttle2LocationIndex % route.length];
  
  console.log(
    `Moving the ${shuttle2Id} to the ${JSON.stringify(shuttle2GpsLocation)}`
  );
  signalR.broadcast({
    Hub: "signalRNotificationHub",
    Method: "locationModified",
    Args: [shuttle2Id, shuttle2GpsLocation]
  });
}, 1920);


setInterval(function() {
  var shuttle3Id = "Shuttle_3";
  shuttle3LocationIndex += 10;
  var shuttle3GpsLocation = route[shuttle3LocationIndex % route.length];
  
  console.log(
    `Moving the ${shuttle3Id} to the ${JSON.stringify(shuttle3GpsLocation)}`
  );
  signalR.broadcast({
    Hub: "signalRNotificationHub",
    Method: "locationModified",
    Args: [shuttle3Id, shuttle3GpsLocation]
  });
}, 1720);
