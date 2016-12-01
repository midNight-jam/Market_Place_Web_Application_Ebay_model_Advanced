/**
 * Created by jayam on 11/2/16.
 */
var mongo = require('../db/myMongo.js');
var ObjectID = require('mongodb').ObjectID;

module.exports.getUserCart = function(msg,callback) {
  var res = {};
  console.log('at upadate cart', msg);
  console.log('at upadate cart', msg.user);
  mongo.getConnection(function (mdb, returnMongoConnection) {
    console.log('got connection at upadate cart');
    var coll = mdb.collection('cart');
    coll.find({user: msg.user}).toArray(function (err, results) {
      if (err) {
        console.log('some err', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        console.log('seems working ', res);
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  })
};

module.exports.updateCart = function(msg,callback) {
  var res = {};
  console.log('at upadate cart', msg);
  console.log('at upadate cart', msg.user);
  mongo.getConnection(function (mdb, returnMongoConnection) {
    console.log('got connection at upadate cart');
    var coll = mdb.collection('cart');
    coll.find({user: msg.user}).toArray(function (err, results) {
      if (err) {
        console.log('some err', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        // cart is alerady present add item to it.
        if (results.length > 0) {
          coll.update({user: msg.user}, {$push: {item: msg.item}}, function (err, results) {
            if (err) {
              console.log('some nested error',err);
              returnMongoConnection(mdb);
              callback(err, null);
            }
            else {
              console.log('some nested restuls ',results);
              returnMongoConnection(mdb);
              callback(null, res);
            }
          });
        }
        // add first item to cart.
        else {
          msg.item = [msg.item];
          coll.insertOne(msg, function (err, results) {
            if (err) {
              console.log('seom nested err at insert');
              returnMongoConnection(mdb);
              callback(err, null);
            }
            else {
              console.log('some nested restuls ', results);
              returnMongoConnection(mdb);
              callback(null, results);
            }
          })
        }
        res = results;
        console.log('seems working ', res);
        // returnMongoConnection(mdb);
        // callback(null, res);
      }
    });
  })
};

module.exports.purchaseCart = function(msg,callback) {
  var res = {};
  console.log('at upadate cart', msg);
  console.log('at upadate cart', msg.user);
  mongo.getConnection(function (mdb, returnMongoConnection) {
    console.log('got connection at upadate cart');
    var coll = mdb.collection('cart');
    coll.find({user: msg.user}).toArray(function (err, results) {
      if (err) {
        console.log('some err', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        mongo.getConnection(function (mdb, returnMongoConnection) {
          console.log('got connection at upadate cart');
          var coll = mdb.collection('transactions');
          coll.find({user: msg.user}).toArray(function (err, results2) {
            if (err) {
              console.log('some err', err);
              returnMongoConnection(mdb);
              callback(err, null);
            }
            else {
              // purchase is alerady present add item to it.
              if (results2.length > 0) {
                console.log('purcahse already present');
                console.log('results.item ', results[0].item);
                var transactions = mdb.collection('transactions');
                transactions.update({user: msg.user}, {$push: {item: {$each: results[0].item}}}, function (err, results3) {
                  if (err) {
                    console.log('some nested error', err);
                    returnMongoConnection(mdb);
                    callback(err, null);
                  }
                  else {
                    // console.log('some nested restuls ', results3);
                    returnMongoConnection(mdb);
                    // callback(null, results3);
                  }

                  mongo.getConnection(function (mdb, returnMongoConnection) {
                    var coll = mdb.collection('advertisements');
                    // console.log('ITEMSSS 555 ', results[0].item);
                    results[0].item.forEach(function (it) {
                      var obj_id = new ObjectID(it.id);
                      //> db.advertisements.update({name:'motorola x2'},{$inc:{quantity:-1}})
                      coll.update({_id: obj_id}, {$inc: {quantity: -(it.quantity)}}, function (err, results5) {
                        if (err) {
                          console.log('some anested err 5555', err);
                          returnMongoConnection(mdb);
                          // callback(err, null);
                        }
                        else {
                          // console.log('some anested results 5555', results5);
                          returnMongoConnection(mdb);
                          // callback(null, results5);
                        }
                      });
                    });
                  });

                  ///////remove from cart 7 insert in transactions////////

                  //insert in transactions
                  mongo.getConnection(function (mdb, returnMongoConnection) {
                    var coll = mdb.collection('transactions');
                    // var obj_id = new ObjectID(msg.id);
                    //> db.transactions.update({user:'w'},{$push:{item:{$each:[{a:1},{a:2}]}}},{upsert:true,safe:false})
                    coll.update({user: msg.user},{$push:{item:{$each:results[0].item}}}, function (err, results6) {
                      if (err) {
                        console.log('some err', err);
                        returnMongoConnection(mdb);
                        // callback(err, null);
                      }
                      else {
                        res = results6;
                        // console.log('seems working ', res);
                        returnMongoConnection(mdb);
                        // callback(null, res);
                      }
                    });
                  })

                  mongo.getConnection(function (mdb, returnMongoConnection) {
                    var coll = mdb.collection('cart');
                    var obj_id = new ObjectID(msg.id);
                    coll.deleteOne({user: msg.user}, function (err, results6) {
                      if (err) {
                        console.log('some err', err);
                        returnMongoConnection(mdb);
                        callback(err, null);
                      }
                      else {
                        res = results6;
                        console.log('seems working ', res);
                        returnMongoConnection(mdb);
                        callback(null, res);
                      }
                    });
                  })
                  //////////////

                });
              }
              //first purchase
              else {
                var purchase = {user: msg.user, item: results[0].item}
                coll.insertOne(purchase, function (err, results4) {
                  if (err) {
                    console.log('seom nested err at insert');
                    returnMongoConnection(mdb);
                    // callback(err, null);
                  }
                  else {
                    // console.log('some nested restuls ', results4);
                    returnMongoConnection(mdb);
                    // callback(null, results4);
                  }
                  mongo.getConnection(function (mdb, returnMongoConnection) {
                    var coll = mdb.collection('advertisements');
                    console.log('ITEMSSS 555 ', results[0].item);
                    results[0].item.forEach(function (it) {
                      var obj_id = new ObjectID(it.id);
                      //> db.advertisements.update({name:'motorola x2'},{$inc:{quantity:-1}})
                      coll.update({_id: obj_id}, {$inc: {quantity: -1}}, function (err, results5) {
                        if (err) {
                          console.log('some anested err 5555', err);
                          returnMongoConnection(mdb);
                          // callback(err, null);
                        }
                        else {
                          console.log('some anested results 5555', results5);
                          returnMongoConnection(mdb);
                          // callback(null, results5);
                        }
                      });
                    });
                  });

                  ///////remove from cart 7 insert in transactions////////

                  //insert in transactions
                  mongo.getConnection(function (mdb, returnMongoConnection) {
                    var coll = mdb.collection('transactions');
                    // var obj_id = new ObjectID(msg.id);
                    //> db.transactions.update({user:'w'},{$push:{item:{$each:[{a:1},{a:2}]}}},{upsert:true,safe:false})
                    coll.update({user: msg.user},{$push:{item:{$each:results[0].item}}}, function (err, results6) {
                      if (err) {
                        console.log('some err', err);
                        returnMongoConnection(mdb);
                        // callback(err, null);
                      }
                      else {
                        res = results6;
                        console.log('seems working ', res);
                        returnMongoConnection(mdb);
                        // callback(null, res);
                      }
                    });
                  })

                  mongo.getConnection(function (mdb, returnMongoConnection) {
                    var coll = mdb.collection('cart');
                    var obj_id = new ObjectID(msg.id);
                    coll.deleteOne({user: msg.user}, function (err, results6) {
                      if (err) {
                        console.log('some err', err);
                        returnMongoConnection(mdb);
                        callback(err, null);
                      }
                      else {
                        res = results6;
                        console.log('seems working ', res);
                        returnMongoConnection(mdb);
                        callback(null, res);
                      }
                    });
                  })

                  //////////////
                });
              }
            }
          });
        })
      }
    });
  })
};

module.exports.updateItemInCart = function(msg,callback) {
  var res = {};
  console.log('at upadate cart', msg);
  console.log('at upadate cart', msg.user);
  mongo.getConnection(function (mdb, returnMongoConnection) {
    console.log('got connection at upadate cart');
    var coll = mdb.collection('cart');
    //> db.cart.update({user:'w','item.name':'bubble gum'},{$set:{'item.$.quantity':-2}})
    coll.update({
      user: msg.user,
      'item.id': msg.item.id
    }, {$set: {'item.$.quantity': msg.item.quantity}}, function (err, results) {
      if (err) {
        console.log('some err', err);
        returnMongoConnection(mdb);
        callback(err, null);
      }
      else {
        res = results;
        console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFf', res);
        returnMongoConnection(mdb);
        callback(null, res);
      }
    });
  })
};

module.exports.removeItemFromCart = function(msg,callback) {
  var res = {};
  console.log('at upadate cart', msg);
  console.log('at upadate cart', msg.user);
  mongo.getConnection(function (mdb, returnMongoConnection) {
    console.log('got connection at upadate cart');
    var coll = mdb.collection('cart');
    //>> db.cart.update({user:'w'},{$pull:{'item':{name:'bubble gum'}}},{multi:true});

    coll.update({
        user: msg.user
      },
      {$pull: {'item': {id: msg.item.id}}},
      function (err, results) {
        if (err) {
          console.log('some err', err);
          returnMongoConnection(mdb);
          callback(err, null);
        }
        else {
          res = results;
          console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDd', res);
          returnMongoConnection(mdb);
          callback(null, res);
        }
      });
  })
};
