import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './MapContainer'


class App extends Component {

  state = {
    google: null,
    selectedPlace: null,
    selectedPlaceDetails: null,
    places: [],
    filteredPlaces: [],
    showingError: false
  }
  
  onMapLoaded(mapProps, map) {
    const {google} = mapProps;
    const service = new google.maps.places.PlacesService(map);

    function callback(results, status) {
      let success = (status === google.maps.places.PlacesServiceStatus.OK)
      let places = success ? results : null

      this.setState({
        google: { mapProps: mapProps, map: map},
        selectedPlace: null,
        selectedPlaceDetails: null,
        places: places, 
        filteredPlaces: places, 
        error: !success});
    }

    var london = new google.maps.LatLng(51.51, -0.11);
    var request = {
      location: london,
      radius: '1000',
      type: ['museum']
    };

    service.nearbySearch(request, callback.bind(this));
  }

  updateQuery(query) {
    function filterPlaces(place){
        if (query.length > 0) {
          return place.name.toLowerCase().includes(query.toLowerCase())
        }
        return true;
    }
    
    let places = this.state.places;
    this.setState({
      google: this.state.google,
      selectedPlace: null,
      selectedPlaceDetails: null,
      places: places,
      filteredPlaces: this.state.places.filter(filterPlaces),
      showingError: false
    });
  }

  fetchDetails(place){

    if (place == null) {
      return
    }

    var request = {
        placeId: place.place_id,
        fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'photos']
    };

    const {google} = this.state.google.mapProps
    const map = this.state.google.map

    function callback(details, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.setState({
          google: this.state.google,
          selectedPlace: place,
          selectedPlaceDetails: details,
          places: this.state.places,
          filteredPlaces: this.state.filteredPlaces,
          showingError: false
        });
      }
    }

    let service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback.bind(this));
  }

  onPlaceSelected(place){
    let places = this.state.places;
    let filteredPlaces = this.state.filteredPlaces;
    this.setState({
      google: this.state.google,
      selectedPlace: place,
      selectedPlaceDetails: null,
      places: places,
      filteredPlaces: filteredPlaces,
      showingError: false
    });

    this.fetchDetails(place)
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1>London's Museums</h1>
        </header>
        <MapContainer 
          selectedPlace={this.state.selectedPlace}
          selectedPlaceDetails={this.state.selectedPlaceDetails}
          places={this.state.filteredPlaces} 
          onMapLoaded={this.onMapLoaded.bind(this)} 
          onPlaceSelected={this.onPlaceSelected.bind(this)} />
      </div>
    );
  }
}

export default App;
