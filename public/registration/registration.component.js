angular.module('registration').component('registration', {
  templateUrl: 'registration/registration.template.html',
  controller: ['$http',
    '$scope',
    '$location',
    function ($http, $scope, $location) {

      $scope.firstname = '';
      $scope.lastname = '';
      $scope.password = '';
      $scope.reenterpassword = '';
      $scope.email = '';
      $scope.bday = '';
      $scope.cellno = '';
      $scope.location = '';
      $scope.ebayHandle = '';

      $scope.invalid_fn = true;
      $scope.invalid_ln = true;
      $scope.invalid_pwd = true;
      $scope.invalid_rpwd = true;
      $scope.invalid_em = true;
      $scope.invalid_bd = true;
      $scope.invalid_ebh = true;
      $scope.invalid_cph = true;
      $scope.invalid_loc = true;

      var movedin = false;
      var cpRegex = new RegExp("^[0-9]{10}$");
      $scope.hoverIn = function () {
        var msg = 'user at registration';
        movedin = true;
        $http({
          method: 'POST',
          url: '/logger',
          data: {
            text: msg
          }
        }).then(function (res) {
          //console.log('sent');
        });
      };

      $scope.hoverOut = function () {
        movedin = false;
      };

      function checkInputs() {
        var allValid = true;
        if ($scope.firstname === '') {
          $scope.invalid_fn = false;
          allValid = false;
        }
        else {
          $scope.invalid_fn = true;
        }

        if ($scope.lastname === '') {
          $scope.invalid_ln = false;
          allValid = false;
        }
        else {
          $scope.invalid_ln = true;
        }

        if ($scope.password === '') {
          $scope.invalid_pwd = false;
          allValid = false;
        }
        else {
          $scope.invalid_pwd = true;
        }


        if ($scope.reenterpassword === '' || ($scope.reenterpassword !== $scope.password)) {
          $scope.invalid_rpwd = false;
          allValid = false;
        }
        else {
          $scope.invalid_rpwd = true;
        }


        if ($scope.email.indexOf('@') < 0) {
          $scope.invalid_em = false;
          allValid = false;
        }
        else {
          $scope.invalid_em = true;
        }


        if (!$scope.bday) {
          $scope.invalid_bd = false;
          allValid = false;
        }
        else {
          $scope.invalid_bd = true;
        }


        if (!cpRegex.test($scope.cellno)) {
          $scope.invalid_cph = false;
          allValid = false;
        }
        else {
          $scope.invalid_cph = true;
        }


        if ($scope.location === '') {
          $scope.invalid_loc = false;
          allValid = false;
        }
        else {
          $scope.invalid_loc = true;
        }


        if ($scope.ebayHandle === '') {
          $scope.invalid_ebh = false;
          allValid = false;
        }
        else {
          $scope.invalid_ebh = true;
        }


        return allValid;
      }

      $scope.register = function () {
        var allValid = checkInputs();
        if (allValid) {
          var smallBday = $scope.bday.toISOString().split('T')[0];
          $http({
            method: 'POST',
            url: '/registration2',
            data: {
              "firstname": $scope.firstname,
              "lastname": $scope.lastname,
              "email": $scope.email,
              "password": $scope.password,
              "birthday": smallBday,
              "location": $scope.location,
              "cellphone": $scope.cellno,
              "ebayhandle": $scope.ebayHandle
            }
          }).then(function (res) {
            if (res.status === 200) {
              alert('Registerd use your credentials');
              $location.path('/');
            }
            else {
              alert('Please try after some time. Error - '+res.data.err);
            }
          });
        }
      };

      $scope.cancel = function () {
        $location.path('/');
      };
    }]
});