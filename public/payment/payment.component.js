angular.module('payment').component('payment', {
  templateUrl: 'payment/payment.template.html',
  controller: [
    '$http',
    '$location',
    function ($http, $location) {

      var paymentCtrl = this;
      $http({
        method: 'POST',
        url: '/checkoutCart2'
      }).then(function (res) {
        paymentCtrl.payamount = res.data.totalAmount;
      });

      var movedin = false;
      paymentCtrl.invalid_card = true;
      this.hoverIn = function () {
        var msg = 'At the payment form';
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

      this.hoverOut = function () {
        movedin = false;
      };

      this.pay = function () {
        $http({
          method: 'POST',
          url: '/processPayment2',
          data: {
            cardNumber: this.cardNumber,
            validTillDate: this.validTillDate,
            nameOnCard: this.nameOnCard,
            amount: this.payamount
          }
        }).then(function (res) {

          if (res.data.res.Status === 'Failure') {
            paymentCtrl.invalid_card = false;
          }
          else {
            $location.path('/advertisementslist')
          }
        });
      };

      this.cancel = function () {
        $location.path('/advertisementslist');
      };
    }]
});