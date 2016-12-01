angular.module('profile').component('profile', {
  templateUrl: 'profile/profile.template.html',
  controller: [
    '$http',
    '$location',
    function ($http, $location) {
      var profileCtrl = this;

      $http({
        method: 'GET',
        url: '/isAuthenticated'
      }).then(function (res) {
        if (res.data.authenticated) {
          console.log('okay  ' + res.data.user);
        }
        else {
          $location.path('/login');
        }
      });

      this.done = function () {
        $location.path('/advertisementslist');
      };
      $http({
        method: 'GET',
        url: '/getLoggedInUserProfile2'
      }).then(function (res) {
        var userprofile = res.data[0];
        profileCtrl.birthday = userprofile.birthday;
        profileCtrl.cellno = userprofile.cellno;
        profileCtrl.email = userprofile.email;
        profileCtrl.firstname = userprofile.firstname;
        profileCtrl.lastname = userprofile.lastname;
        profileCtrl.location = userprofile.location;
        profileCtrl.lastlogin = userprofile.lastLogin;
        profileCtrl.ebayhandle = userprofile.ebayhandle;
      });
    }]
});