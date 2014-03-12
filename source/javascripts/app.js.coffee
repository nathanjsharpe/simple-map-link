app = angular.module 'simplemaplink', []

app.controller 'MainCtrl', ($scope, Geocoder, GoogleMap) ->
  $scope.getCoords = ->
    Geocoder.geocode
      address: $scope.address
    , (results, status) ->
      $scope.geocodeResults = results
      if results.length == 1
        $scope.selectResult results[0]
      $scope.$apply()

  $scope.selectResult = (result) ->
    if $scope.selectedResult != result
      $scope.selectedResult = result
      GoogleMap.setLocation result.geometry.location
      GoogleMap.create()
      GoogleMap.addMarker()

      if $scope.placeSearch
        $scope.findPlaces()

  $scope.findPlaces = ->
    GoogleMap.textSearch $scope.placeSearch, (results, status) ->
      $scope.placeResults = results
      $scope.$apply()

  $scope.selectPlace = (place) ->
    $scope.selectedPlace = place
    console.log place
    $scope.makeLink(place)

  $scope.cleanAddress = (address) ->
    address.replace /, United States/, ''
    .replace /,/g, ''
    .replace /\W/g, '+'

  $scope.makeLink = (place) ->
    $scope.linkDisplayed = true
    $scope.placeAddress = $scope.cleanAddress $scope.selectedPlace.formatted_address

  $scope.reset = ->
    $scope.address = ''
    $scope.placeSearch = ''
    $scope.linkDisplayed = false
    $scope.geocodeResults = []
    $scope.placeResults = []
    $scope.selectedResult = null
    $scope.selectedPlace = null
    $scope.placeAddress = ''


app.factory 'Geocoder', ->
  geocoder = new google.maps.Geocoder();

app.factory 'GoogleMap', ->
  location = null
  map = null
  places = null

  GoogleMap =
    setLocation: (latLng) ->
      location = latLng

    create: (position = location, zoom = 15) ->
      map = new google.maps.Map document.getElementById("map-canvas"),
        center: location
        zoom: zoom
      places = new google.maps.places.PlacesService(map)

    addMarker: (position = location) ->
      marker = new google.maps.Marker
        map: map
        position: position

    map: ->
      map

    nearbySearch: (keyword, callback) ->
      places.nearbySearch
        location: location
        radius: 5000
        keyword: keyword
      , callback

    textSearch: (query, callback) ->
      places.textSearch
        location: location
        radius: 5000
        query: query
      , callback
