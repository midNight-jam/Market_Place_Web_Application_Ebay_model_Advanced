angular.module('advertisement').component('advertisement', {
  templateUrl: 'advertisement/advertisement.template.html',
  controller: [
    '$http',
    '$scope',
    '$location',
    function ($http, $scope, $location) {

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

      $scope.cancelAd = function () {
        $location.path('/advertisementslist');
      };

      function checkInputs() {
        var allValid = true;
        if ((!$scope.itemname) || ($scope.itemname === '')) {
          $scope.invalid_nm = false;
          allValid = false;
        }
        else {
          $scope.invalid_nm = true;
        }

        if ((!$scope.itemdescription ) || ($scope.itemdescription === '')) {
          $scope.invalid_dc = false;
          allValid = false;
        }
        else {
          $scope.invalid_dc = true;
        }

        if ((!$scope.sellerinformation) || ($scope.sellerinformation === '')) {
          $scope.invalid_sl = false;
          allValid = false;
        }
        else {
          $scope.invalid_sl = true;
        }


        if ((!$scope.isBid) && ((!$scope.itemprice ) || ($scope.itemprice <=0))) {
          $scope.invalid_pr = false;
          allValid = false;
        }
        else {
          $scope.invalid_pr = true;
        }


        if ((!$scope.itemquantity) || ($scope.itemquantity < 1)) {
          $scope.invalid_qn = false;
          allValid = false;
        }
        else {
          $scope.invalid_qn = true;
        }
        return allValid;
      }

      $scope.submitAd = function () {
        console.log();
        console.log('Name:' + $scope.itemname);
        var isbidType = $scope.isBid === true ? true : false;
        var date = new Date();
        var newdate = new Date((new Date()).getTime() + (4 * 86400000));
        var allValid = checkInputs();
        if (allValid) {
          $http({
            method: 'POST',
            url: '/advertisement2',
            data: {
              itemname: $scope.itemname,
              itemdescription: $scope.itemdescription,
              sellerinformation: $scope.sellerinformation,
              itemprice: $scope.itemprice,
              itemquantity: $scope.itemquantity,
              isBid: $scope.isBid,
              enddate: newdate
            }
          }).then(function (res) {
            if (res.data.res.ok === 1) {
              alert('Submitted ur add');
              $location.path('/advertisementslist');
            }
            else {
              alert('Please try after some time. Error - '+res.data.err);
            }
          });
        }

      };
    }]
});