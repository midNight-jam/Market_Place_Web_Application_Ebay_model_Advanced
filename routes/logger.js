var winston = require('winston');
winston.log('info', 'winston up!');

var logger = new (winston.Logger)({
	transports:[
	            new (winston.transports.File)({ filename: 'ebayjusersactivity.log' })
	            ]
});

module.exports=logger;