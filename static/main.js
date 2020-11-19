(function () {
  'use strict';

  let app = angular.module('WordcountApp', []);

  app.controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function($scope, $log, $http, $timeout) {

      $scope.submitButtonText = 'Submit';
      $scope.loading = false;
      $scope.urlerror = false;

      $scope.getResults = function() {
        $log.log("test");

        let user_input = $scope.url;

        $http.post('/start', {'url': user_input}).
          then(function(results){
            $log.log(results);
            getWordCount(results)
            $scope.wordcounts = 0;
            $scope.loading = true;
            $scope.submitButtonText = 'loading...'
            $scope.urlerror = false;
          },
          function(error) {
            $log.log(error);
          });
      };

      function getWordCount(jobID) {
        let timeout = "";
        let poller = function() {
          // fire another request
          $http.get('/results/' +  jobID.data  ).
            then(function(jobID) {
              const { data, status, headers, config } = jobID;
              if(status === 202) {
                $log.log(data, status);
              } else if (status === 200){
                $log.log(data);
                $scope.loading = false;
                $scope.submitButtonText = 'Submit';
                $scope.wordcounts = data
                $timeout.cancel(timeout);
                return false;
              }
              // continue to call the poller() function every 2 seconds
              // until the timeout is cancelled
              timeout = $timeout(poller, 2000);
            },
            function(error) {
              $log.log(error);
              $scope.loading = false;
              $scope.submitButtonText = "Submit";
              $scope.urlerror = true;
            });
        };
      poller();
    }
  }]);
}());
