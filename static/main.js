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
  }])

  .directive('wordCountChart', ['$parse', function($parse) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="chart"></div>',
      link: function(scope) {
        scope.$watch('wordcounts', function () {
          d3.select('#chart').selectAll('*').remove();
          let data = scope.wordcounts;
          for (let word in data) {
            let key = data[word][0]
            let value = data[word][1]
            d3.select('#chart')
              .append('div')
              .selectAll('div')
              .data(word)
              .enter()
              .append('div')
              .style('width', function() {
                return (value * 3) + 'px'
              })
              .text(function(d) {
                return key
              });
          }
        }, true);
      }
    };
  }]);
}());
