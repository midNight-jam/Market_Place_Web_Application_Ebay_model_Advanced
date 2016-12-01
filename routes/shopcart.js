"use strict";
function checkCardDetails(recievedCard){
	var result = checkCard(recievedCard);
	return result;
}

function checkCard (card){
	var result = {};
	if(!isValidCardNumber(card.cardNumber)){
		result.Status="Failure";
		result.Description="Not a Valid Cad Number";
		return result;
	}
	if(!isValidNameOnCard(card.nameOnCard)){
		result.Status="Failure";
		result.Description="Not a Valid name";
		return result;
	}

	result.Status="Success";
	result.Description="Payment Processed";
	return result;
}

function isValidCardNumber(cardNumber){
	var cardNoRegex = /^\d{16}$/;
	return cardNoRegex.test(cardNumber);
}

function isValidTillDate(cardDate){
	var date = new Date(cardDate).getTime();
	var past = new Date('01/01/2000').getTime();
	var future  = new Date('01/01/2020').getTime();
	var isValid = (date< future ) && (date > past);
	return isValid;
}

function isValidNameOnCard (nameOnCard){
	var nameRegex = /^[\w\s]+$/;
	return nameRegex.test(nameOnCard);	
}

var mqClient = require('../rpc/client');

module.exports.addToCart2 = function(req,res) {
  var id = req.param("id");
  var name = req.param("name");
  var description = req.param("description");
  var seller = req.param("seller");
  var price = req.param("price");
  var quantity = req.param("quantity");

  var msg_payload = {
    payload: {
      user: req.user.username,
      item: {
        id: req.param("id"),
        name: req.param("name"),
        description: req.param("description"),
        seller: req.param("seller"),
        price: req.param("price"),
        quantity: req.param("quantity")
      }
    },
    target: 'updateCart'
  };

  mqClient.make_request('cart_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
			res.send({"err": err});
    }
    res.send({"res": results});
  });
};

module.exports.getCart2 = function(req,res) {
  var msg_payload = {payload: {user: req.user.username}, target: "getUserCart"};
  mqClient.make_request('cart_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
			res.send({"err": err});
    }
    var total = 0;
    console.log('+++++++++++++++++++++++++++++++++', results[0].item);
    results[0].item.forEach(function (it) {
      total += it.quantity * it.price;
    });
    res.send({amount: total, "res": results});
  });
};

module.exports.checkoutCart2 = function(req,res) {
  var msg_payload = {payload: {user: req.user.username}, target: "getUserCart"};
  mqClient.make_request('cart_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
			res.send({"err": err});
    }

    var total = 0;
    results[0].item.forEach(function (it) {
      total += it.quantity * it.price;
    });
    // res.send({checkoutAmount: total});
    res.send({"totalAmount": total});
  });
};

module.exports.processPayment2 = function(req,res) {
  var recievedCard = req.body;
  var result = checkCardDetails(recievedCard);
  console.log('result  ' + result.Status);
  console.log('result  ' + result.Description);
  if (result.Status === 'Success') {

    var msg_payload = {payload: {user: req.user.username}, target: "purchaseCart"};
    mqClient.make_request('cart_queue', msg_payload, function (err, results) {
      console.log('Client received results ' + JSON.stringify(results));
      if (err) {
				res.send({"err": err});
      }
      res.send({"res": results});
    });
  }
  else {
    res.send({"res": result});
  }
};

module.exports.updateItemInCart = function(req,res) {

  var msg_payload = {
    payload: {
      user: req.user.username,
      item: {
        id: req.param("id"),
        name: req.param("name"),
        description: req.param("description"),
        seller: req.param("seller"),
        price: req.param("price"),
        quantity: req.param("quantity")
      }
    },
    target: 'updateItemInCart'
  };


  mqClient.make_request('cart_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
			res.send({"err": err});
    }
    res.send({"res": results});
  });

};

module.exports.removeFromCart2 = function(req,res){
  console.log('body  , ',req.body);
  console.log('body  , ',req.param('item').id);
  var id = req.param("item.id");
  var name = req.param("item.name");
  var description = req.param("item.description");
  var seller = req.param("item.seller");
  var price = req.param("item.price");
  var quantity = req.param("item.quantity");

  var msg_payload = {
    payload: {
      user: req.user.username,
      item: {
        id: req.param('item').id,
        name: req.param('item').name,
        description: req.param('item').description,
        seller: req.param('item').seller,
        price: req.param('item').price,
        quantity: req.param('item').quantity
      }
    },
    target: 'removeItemFromCart'
  };

  console.log('RRRRRRRRRRRRRRRRr',msg_payload);
  mqClient.make_request('cart_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
			res.send({"err": err});
    }
    res.send({"res": results});
  });
};