'use strict';
angular
  .module('chipsCustomInputDemo', ['ngMaterial'])
  .controller('CustomInputDemoCtrl', DemoCtrl)
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function DemoCtrl($scope, $timeout, $q) {
  var usedKeys = {};
	var suggests;
  
  $scope.presEnter = function(e){
    var autoChild = document.getElementById('Auto').firstElementChild;
    var el = angular.element(autoChild);
    el.scope().$mdAutocompleteCtrl.hidden = true;
  };
  
  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.querySearch = querySearch;
  $scope.selectedVegetables = [];

  // is there any other way to trach changes?
  $scope.$watch('selectedVegetables.length', function() {
    usedKeys = {};
    
    angular.forEach($scope.selectedVegetables, function(item) {
      usedKeys[item.name] = true;
    });
  });

  function fetchVegs(query) {
    var vegetables = loadVegetables();
    var defer = $q.defer();

    $timeout(function() {
      suggests = vegetables;

      defer.resolve(vegetables);
    }, Math.random() * 1000, false);

    return defer.promise;
  }

  function querySearch(query) {
    if (suggests) {
      return suggests.filter(createFilterFor(query));
    } else {
      // simulate async request
      return fetchVegs(query).then(function(suggests) {
        return suggests.filter(createFilterFor(query));
      });
    }
  }

  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(vegetable) {
      if (usedKeys[vegetable.name]) {
        return false;
      }

      if (lowercaseQuery) {
        return (vegetable._lowername.indexOf(lowercaseQuery) !== -1) ||
          (vegetable._lowertype.indexOf(lowercaseQuery) !== -1);
      }

      return true;
    };
  }

  function loadVegetables() {
    var veggies = [{
      'name': 'Broccoli',
      'type': 'Brassica'
    }, {
      'name': 'Cabbage',
      'type': 'Brassica'
    }, {
      'name': 'Carrot',
      'type': 'Umbelliferous'
    }, {
      'name': 'Lettuce',
      'type': 'Composite'
    }, {
      'name': 'Spinach',
      'type': 'Goosefoot'
    }];

    return veggies.map(function(veg) {
      veg._lowername = veg.name.toLowerCase();
      veg._lowertype = veg.type.toLowerCase();
      return veg;
    });
  }
}