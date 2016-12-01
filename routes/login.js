var crypto = require('crypto');
var crypto = require('crypto');
var key = 'abcdefg';
var mqClient = require('../rpc/client');

module.exports.logoutUser2  =function(req,res) {
	var msg_payload = {
		payload: {
			email: req.user.username
		},
		target: 'logoutUser'
	};
	mqClient.make_request('login_queue', msg_payload, function (err, results) {
		console.log('Client received results ' + JSON.stringify(results));
		if (err) {
      res.send({"err": err});
		}
		req.session.destroy(function (err) {
			res.redirect('/');
		});
	});
}

module.exports.getLoggedInUserProfile2 = function(req,res) {

  if(!req.user){
    res.send({});
  }
  var msg_payload = {
    payload: {
      email: req.user.username
    },
    target: 'getLoggedInUser'
  };
  mqClient.make_request('login_queue', msg_payload, function (err, results) {
    console.log('Client received results ' + JSON.stringify(results));
    if (err) {
      res.send({"err": err});
    }
    res.send(results);
  });
};

module.exports.getLoggedInUser2 = function(req,res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  console.log('`````trying to get user form rew -- ', req.user);
  var user = req.user?req.user.username:'';
  res.send({
    'user': user
  });
};

module.exports.isAuthenticated = function(req,res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  console.log('`````trying to get user form rew -- ', req.user);
  var authenticated = (req.user) ? true : false;
  res.send({
    authenticated:authenticated
  });
};