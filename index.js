var mydb;
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var filter = {};

MongoClient.connect("mongodb://localhost:27017/geo", function(err, db) {
  if (err){
    console.log("dberror",err);
  }
  else{
    console.log("Connected correctly to server");
    mydb = db;
    app.listen(3000);
    console.log("Server listening...");
  }
});

app.get('/geo-search-results', function(req, res){
  //console.log(req.query);

  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var radius = parseFloat(req.query.radius);

  if (Math.abs(longitude) > 0.00001 &&
  Math.abs(latitude) > 0.00001) {
    filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius ] } };
  }

  // console.log("filter", filter, [ longitude, latitude ]);
  //console.log("toto",mydb);


  mydb.collection('equip').find(filter).toArray(function(err, docs) {
    console.log("Found "+docs.length+" records");
    // console.dir(docs);
    res.render('geo-search-results', {
      results: docs
    });
  });
});

app.get('/geo-search-results-json', function(req, res){
  //console.log(req.query);

  var latitude = parseFloat(req.query.latitude);
  var longitude = parseFloat(req.query.longitude);
  var radius = parseFloat(req.query.radius);

  if (Math.abs(longitude) > 0.00001 &&
  Math.abs(latitude) > 0.00001) {
    filter.geometry = { "$geoWithin": { "$center": [ [ longitude, latitude ] , radius ] } };
  }

  // console.log("filter", filter, [ longitude, latitude ]);
  //console.log("toto",mydb);


  mydb.collection('equip').find(filter).toArray(function(err, docs) {
    console.log("Found "+docs.length+" records");
    // console.dir(docs);
    res.json(
      {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": docs
      }
    );
  });
});


app.get('/geo-search', function(req, res){
  res.render('form');
});
app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));
app.post('/', function(req, res){
  console.log(req.body);
  res.send("received your request!");
});
app.use('/static', express.static('public'));
