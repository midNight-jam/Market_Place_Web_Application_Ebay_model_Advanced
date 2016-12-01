angular.module('transactions').component('transactions', {
  templateUrl: 'transactions/transactions.template.html',
  controller: [
    '$http',
    '$location',
    function ($http, $location) {
      var transactionsCtrl = this;

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

      $http({
        method: 'GET',
        url: '/transactions2'
      }).then(function (res) {
        if (res.status === 200) {
          // transactionsCtrl.transactions = res.data.res;
          transactionsCtrl.transactions = res.data.res[0].item;
        }
        else {
          alert('Please try after some time. Error - '+res.data.err);

        }
      });

      $http({
        method: 'GET',
        url: '/wonbidsList2'
      }).then(function (res) {
        if (res.status === 200) {
          transactionsCtrl.bids = res.data.res;
        }
        else {
          alert('Please try after some time. Error - '+res.data.err);
        }
      });


      var movedin = false;
      this.hoverIn = function () {
        var msg = 'browsing the transactions';
        this.log(msg);
        movedin = true;

      };

      this.hoverOut = function () {
        movedin = false;
      };

      this.log = function (msg) {
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

    }
  ]
});