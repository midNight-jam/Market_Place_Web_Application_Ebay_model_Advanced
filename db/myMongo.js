/**
 * Created by Jayam on 10/31/2016.
 */

"use strict";
var MongoClient = require('mongodb').MongoClient;
var connectionString =  'mongodb://localhost:27017/ebayj';
var db;
var connected = false;
var mongoConnections = [];
var poolSize = 4;
var poolCreated = false;

////////////////////////<PoolSetup>////////////////////////
console.log('fillinf the connection pool');
fillPool();
 function fillPool() {
   if (!poolCreated) {
     var pending = poolSize;
     for (var i = 0; i < poolSize; i++) {
       createConnection(function (mdb) {
         // console.log('called the pusher calback');
         mongoConnections.push(mdb);
         pending--;
         if (!pending) {
           displayPool();
         }
       });
     }
     poolCreated = true;
   }
 }

function createConnection(callback) {
  MongoClient.connect(connectionString, function (err, _mdb) {
    if (err) {
      throw new Error(err + '\nError couldnt connect to Mongo Db ' + connectionString);
    }
    // console.log('got connection ', _mdb.databaseName);
    // console.log('got connection ', callback);
    callback(_mdb);
  });
};

function displayPool() {
  for(var i=0; i<poolSize;i++){
    console.log('connection i -- ',mongoConnections[i].databaseName);
  }
}

function getConnection(callback) {
  if(mongoConnections.length){
    console.log('connection availed...');
    var mdb = mongoConnections.pop();
    callback(mdb,returnMongoConnection);
  }
  else{
    console.log('connection not available, will wait for 2s ...');
    setTimeout(getConnection,2000,callback);
  }
}

module.exports.getConnection = getConnection;

function returnMongoConnection(mdb) {
  console.log('D-->returning the mongo connection -- ' + mdb.databaseName + ' pool len ' + mongoConnections.length);
  if (mdb) {
    mongoConnections.push(mdb);
  }
  console.log('after returning connection -- ', mongoConnections.length);
};

////////////////////////<PoolSetup/>////////////////////////

/*module.exports.connect = function(callback) {
  MongoClient.connect(connectionString, function (err, _db) {
    if (err) {
      throw new Error(err + '\nError couldnt connect to Mongo Db ' + connectionString);
    }
    db = _db;
    connected = true;
    console.log('Connected to db ' + connectionString);
    callback();
  });
};

module.exports.collection= function(name) {
  if (!connected) {
    throw  new Error('Seems Db is not connected... plz check');
  }
  return db.collection(name);
};*/
