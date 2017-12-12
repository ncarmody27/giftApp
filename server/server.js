const express = require('express');
const app = express();
//const port=3000;
var port = process.env.PORT || 3000;        // set our port
app.use(express.static('website'));


var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var uri = 'mongodb://bear:Password-1@cluster0-shard-00-00-yqvw6.mongodb.net:27017,cluster0-shard-00-01-yqvw6.mongodb.net:27017,cluster0-shard-00-02-yqvw6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
			console.log("Found the following records");
			console.log(docs)
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

router.get('/bears/:bear_id',function(req, res){
	console.log(req.params.bear_id);
	test = require('assert');
	
	/*
	MongoClient.connect(uri, function(err, db) {
		db.collection('bears').find(req.params.bear_id).toArray(function(err, docs){
			res.json(docs);
			db.close();
		})
		
	})*/
	(async function() {
  let client;

  try {
    client = await MongoClient.connect(uri);
    console.log("Connected correctly to server");

    const db = client.db('test');

    // Get the collection
    const col = db.collection('bears');

    // Get the cursor
		var ObjectId = require('mongodb').ObjectId; 
  	var id = req.params.bear_id;       
		var o_id = new ObjectId(id);
		
    var cursor = col.find({_id:o_id});
    // Iterate over the cursor
    while(await cursor.hasNext()) {
      const doc = await cursor.next();
			console.log(`doc: ${doc}`);
      console.dir(doc);
			res.json(doc);
    }
  } catch (err) {
    console.log(err.stack);
  }

  // Close connection
  client.close();
})();
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port,() => console.log(`Website listening on port: ${port}!`));