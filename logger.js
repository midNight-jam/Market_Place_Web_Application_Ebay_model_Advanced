  var winston = require('winston');
  winston.log('info', 'Hello distributed log files!');
  winston.info('Hello again distributed logs');
  
  var logger = new (winston.Logger)({
	  transports:[
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'somefile.log' })
				]
  });
  
  logger.log('logging log with logger');
  logger.info('logging log with logger ZZZZZ');  
  module.exports=logger;