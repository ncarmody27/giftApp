// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var uri = 'mongodb://bear:Password-1@cluster0-shard-00-00-yqvw6.mongodb.net:27017,cluster0-shard-00-01-yqvw6.mongodb.net:27017,cluster0-shard-00-02-yqvw6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
// create a bear (accessed at POST http://localhost:8080/api/bears)
router.post('/bears', function (req, res) {
	//console.log(req.query);
	MongoClient.connect(uri, function(err, db) {
		console.log("Connected successfully to server");
		db.collection('bears').insertOne(req.query)
		.then(function(result){
			res.json({message: 'Bear created!'});
			db.close();
		})
	})	
});
// get all the bears (accessed at GET http://localhost:8080/api/bears)
router.get('/bears',function(req, res) {
	var findDocuments = function(db, callback) {
  // Get the documents collection
		var collection = db.collection('bears');
		// Find some documents
		collection.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			//console.log(docs)
			res.json(docs);
			callback(docs);
		});
}

// Use connect method to connect to the server
	MongoClient.connect(uri, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
    findDocuments(db, function() {
      db.close();
    });
  });
});

router.get('/bears/id/:_id',function(req, res){
	//console.log(req.params);
	test = require('assert');
	var ObjectId = require('mongodb').ObjectId; 
	var id = req.params._id;       
	var o_id = new ObjectId(id);
	MongoClient.connect(uri, function(err, db) {
		db.collection('bears').find({_id:o_id}).toArray(function(err, docs){
			res.json(docs);
			db.close();
		})
	})
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
