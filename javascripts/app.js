(function() {
  var app;

  app = angular.module('simplemaplink', []);

  app.controller('MainCtrl', function($scope, Geocoder, GoogleMap) {
    $scope.getCoords = function() {
      return Geocoder.geocode({
        address: $scope.address
      }, function(results, status) {
        $scope.geocodeResults = results;
        if (results.length === 1) {
          $scope.selectResult(results[0]);
        }
        return $scope.$apply();
      });
    };
    $scope.selectResult = function(result) {
      if ($scope.selectedResult !== result) {
        $scope.selectedResult = result;
        GoogleMap.setLocation(result.geometry.location);
        GoogleMap.create();
        GoogleMap.addMarker();
        if ($scope.placeSearch) {
          return $scope.findPlaces();
        }
      }
    };
    $scope.findPlaces = function() {
      return GoogleMap.textSearch($scope.placeSearch, function(results, status) {
        $scope.placeResults = results;
        return $scope.$apply();
      });
    };
    $scope.selectPlace = function(place) {
      $scope.selectedPlace = place;
      console.log(place);
      return $scope.makeLink(place);
    };
    $scope.cleanAddress = function(address) {
      return address.replace(/, United States/, '').replace(/,/g, '').replace(/\W/g, '+');
    };
    $scope.makeLink = function(place) {
      $scope.linkDisplayed = true;
      return $scope.placeAddress = $scope.cleanAddress($scope.selectedPlace.formatted_address);
    };
    return $scope.reset = function() {
      $scope.address = '';
      $scope.placeSearch = '';
      $scope.linkDisplayed = false;
      $scope.geocodeResults = [];
      $scope.placeResults = [];
      $scope.selectedResult = null;
      $scope.selectedPlace = null;
      return $scope.placeAddress = '';
    };
  });

  app.factory('Geocoder', function() {
    var geocoder;
    return geocoder = new google.maps.Geocoder();
  });

  app.factory('GoogleMap', function() {
    var GoogleMap, location, map, places;
    location = null;
    map = null;
    places = null;
    return GoogleMap = {
      setLocation: function(latLng) {
        return location = latLng;
      },
      create: function(position, zoom) {
        if (position == null) {
          position = location;
        }
        if (zoom == null) {
          zoom = 15;
        }
        map = new google.maps.Map(document.getElementById("map-canvas"), {
          center: location,
          zoom: zoom
        });
        return places = new google.maps.places.PlacesService(map);
      },
      addMarker: function(position) {
        var marker;
        if (position == null) {
          position = location;
        }
        return marker = new google.maps.Marker({
          map: map,
          position: position
        });
      },
      map: function() {
        return map;
      },
      nearbySearch: function(keyword, callback) {
        return places.nearbySearch({
          location: location,
          radius: 5000,
          keyword: keyword
        }, callback);
      },
      textSearch: function(query, callback) {
        return places.textSearch({
          location: location,
          radius: 5000,
          query: query
        }, callback);
      }
    };
  });

}).call(this);
