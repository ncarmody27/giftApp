'use strict'
//Requires uri to be set to uri of database
//Requires mongo db
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var uri = 'mongodb://bear:Password-1@cluster0-shard-00-00-yqvw6.mongodb.net:27017,cluster0-shard-00-01-yqvw6.mongodb.net:27017,cluster0-shard-00-02-yqvw6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
module.exports = class CRUD{
//Create
static create(collectionName, req, res){
	//takes collectionName[string]
	MongoClient.connect(uri, function(err, db) {
		db.collection(collectionName).insertOne(req.body)
		.then(function(result){
			let ObjectId = require('mongodb').ObjectId; 
			let id = result.insertedId;       
			let o_id = new ObjectId(id);
			db.collection(collectionName).find({_id:o_id}).toArray(function(err, docs){
				res.json(docs);
			})
		db.close();
		})
	})	
}
//Read
static readAll(collectionName, req, res, callback){
	//gets all from the selected collection
	MongoClient.connect(uri, function(err, db) {
		db.collection(collectionName).find({}).toArray(function(err, docs) {
			res.json(docs);
			db.close();
		});
	});
}
static readId(collectionName, req, res, callback){
	//gets by id(generated by MongoDB)
	let ObjectId = require('mongodb').ObjectId; 
	let id = req.params._id;       
	let o_id = new ObjectId(id);
	MongoClient.connect(uri, function(err, db) {
		db.collection(collectionName).find({_id:o_id}).toArray(function(err, docs){
			if (callback === false) {			
				res.json(docs);
			}
			else {
				callback(docs);
			}
		})
	});
}
static readEmail(collectionName, req, res, callback){
	MongoClient.connect(uri, function(err, db) {
		var query={email: req.body.email};
		db.collection(collectionName).find(query).toArray(function(err, docs){
			if (callback === false) {			
				res.json(docs);
			}
			else {
				callback(err, docs);
			}
		})
	});
}
//Update
static update(collectionName, req, res){
	let ObjectId = require('mongodb').ObjectId; 
	let id = req.params._id;       
	let o_id = new ObjectId(id);
	let value = req.query
	MongoClient.connect(uri, function(err, db) {
		db.collection(collectionName).updateOne({_id:o_id}, {$set:value},function(){
			db.close();
		})
	})
}
//Delete
static del(collectionName, req, res){
	let ObjectId = require('mongodb').ObjectId; 
	let id = req.params._id;       
	let o_id = new ObjectId(id);
	let value = req.query
	MongoClient.connect(uri, function(err, db) {
		db.collection(collectionName).deleteOne({_id:o_id}, function(){
			res.json({message: 'Deleted'});
			db.close();
		})
	})
}
//end of CRUD operations
}
