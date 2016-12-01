/**
 * Created by jayam on 11/1/16.
 */
var LocalStrategy = require('passport-local').Strategy;
var mqClient = require('../rpc/client');
var crypto = require('crypto');
var key = 'abcdefg';

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {

      console.log('username ', username);
      console.log('password', password);
      console.log('done ', done);
      var encryptedPassword = crypto.createHmac('sha1', key).update(password).digest('hex');
      var whereParams = {
        payload: {
          email: username,
          password: encryptedPassword
        },
        target: 'loginUser'
      };
      var msg_payload = whereParams;
      mqClient.make_request('login_queue', msg_payload, function (err, user) {
        console.log('Client received results ');
        console.log(user);
        console.log(err);

        if (err === null && user.length == 0) {
          console.log('some err');
          return done(null, false);
        }
        // console.log('Client received results ' + JSON.stringify(user));
        if (err) {
          console.log('err ', err);
          return done(err);
        }
        if (!user) {
          console.log('!user ', user);
          // return done(null, false, {alert: 'Incorrect username.'});
          return done(null, false);
        }
        if (user[0].password != encryptedPassword) {
          console.log('!paswd ', user);
          // return done(null, false, {alert: 'Incorrect password.'});
          return done(null, false);
        }

        var uobj = {username: user[0].email, password: user[0].password};
        console.log('UOBJ   ', uobj);
        // return res.send(uobj);
        return done(null, uobj);
      });
    }
  ));
}

