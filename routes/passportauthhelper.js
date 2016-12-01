/**
 * Created by jayam on 11/2/16.
 */

var passport = require('passport');

module.exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log('Here ...');
    console.log('err ...',err);
    console.log('info ...',info);
    console.log('user ...',user);

    if (err) {
      console.log('err...',err);
      return next(err);
    }
    if (!user) {
      console.log('ZZZZuser...',user);
      return res.send({Status:'failed'});
    }
    console.log('abt to enter login ',user);
    console.log('abt to enter login ');

    req.logIn(user,null, function(err) {
      console.log('ZZZZZZZlogin');
      if (err) { return next(err); }
      console.log(JSON.stringify(user));
      // return res.redirect('/users/' + user.username);
      return res.send(200);
    });
    console.log('ZZZZZZZabout to wxit');
  })(req, res, next);
};
