var mqClient = require('../rpc/client');

module.exports.getTransactions2 = function(req,res) {
	var msg_payload = {payload: {userId: req.user}, target: "getUsersTransactions"};
	mqClient.make_request('transactions_queue', msg_payload, function (err, results) {
		console.log('Client received results ' + JSON.stringify(results));
		if (err) {
			res.send({"err": err});
		}
		res.send({"res": results});
	});
};