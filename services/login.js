/**
 * Created by jayam on 10/28/16.
 */
var mongo = require('../db/myMongo.js');

module.exports.loginUser = function(msg,callback) {
  var res = {};
  console.log('@@@@@In handle request email ', JSON.stringify(msg));
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('users');
    console.log('msg received at ', msg);
    console.log('connected to mdb advertisements');
    var whereParams  = {
      email: msg.email,
      password: msg.password
    };
    console.log('logging where',whereParams);
    coll.find({
      email:msg.email,
      password:msg.password
    }).toArray(function (err, results) {
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        // console.log('results -- ',results);
        res = results;
        // console.log('ZZZ ' + JSON.stringify(res) + ' ZZZ');
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  });
};

module.exports.logoutUser = function(msg,callback) {
  var res = {};
  // console.log('@@@@@In handle request email ', JSON.stringify(msg));
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('users');
    // console.log('msg received at ', msg);
    // console.log('connected to mdb advertisements');
    var whereParams  = {
      email: msg.email
    };
    console.log('logging where',whereParams);
    coll.update({ email: msg.email},
      {$set: {lastLogin:new Date()}}, function (err, results) {
      if (err) {
        console.log('An error - ', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  });
};

module.exports.getLoggedInUser = function(msg,callback) {
  var res = {};
  mongo.getConnection(function (mdb, returnMongoConnection) {
    var coll = mdb.collection('users');
    var whereParams = {
      email: msg.email
    };
    console.log('logging where', whereParams);
    coll.find({email: msg.email}).toArray(function (err, results) {
        if (err) {
          console.log('An error - ', err);
          returnMongoConnection(mdb);
          callback(err, null);
        }
        else {
          res = results;
          returnMongoConnection(mdb);
          callback(null, res);
        }
      });
  });
};