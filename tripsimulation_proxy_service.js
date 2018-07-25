const port = 5000;

var express = require("express");
var SignalRJS = require("signalrjs");
const bodyParser = require("body-parser");
var cors = require('cors');

const newLocal = './data/route.json';

var route = require(newLocal);

var signalR = SignalRJS();

var server = express();
var router = express.Router();

server.use(cors({
  origin: 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

server.use(signalR.createListener());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/* serves main page */
server.get("/", function (req, res) {
  res.sendfile('index.htm');
});

let currentLocationIndex = 0;

/* serves main page */
server.get("/vehiclelocation", function (req, res) {
  console.log("Current vehicle loc index:" + currentLocationIndex);
  res.send(route[currentLocationIndex++ % route.length])
});

server.get("/vehicles", function (req, res) {
  /* some server side logic */
  res.sendfile('data/vehicles.json');
});

server.use("/", router);
console.log("Go to the link: http://localhost:" + port);

server.listen(port);

setInterval(function () {
  var vehicleId = "Shuttle_1";
  currentLocationIndex += 15;
  var gpsLocation = route[currentLocationIndex % route.length];
  console.log(`Moving the vehicle to the ${JSON.stringify(gpsLocation)}`);

  signalR.broadcast({
    Hub: "signalRNotificationHub",
    Method: "locationModified",
    Args: [vehicleId, gpsLocation]
  });
}, 2000);