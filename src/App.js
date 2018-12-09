import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import ListLocations from './ListLocations'
import MapContainer from './MapContainer'
import ResponsiveMenu from './ResponsiveMenu'


class App extends Component {

  state = {
    google: null,
    selectedPlace: null,
    selectedPlaceDetails: null,
    places: [],
    filteredPlaces: [],
    sidebarOpen: true,
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
        sidebarOpen: true, 
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
    var request = {
        placeId: place.place_id,
        fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'photos']
    };

    const {google} = this.state.google.mapProps
    const map = this.state.google.map

    return new Promise( (resolve, reject) => {
      let service = new google.maps.places.PlacesService(map);
      service.getDetails(request, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(details)
        } else {
          reject(status)
        }
      })
    })
  }

  fetchWiki(place){
    let name = encodeURIComponent(place.name)
    return fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${name}&limit=10&namespace=0&origin=*&format=json`)
    .then((response) => {
      return response.json()
    }).then((json) => {
      return new Promise((resolve, reject) => {
        if (json.length > 3 && json[1].length > 0) {
          let wikiDescription = json[2][0]
          let wikiUrl = json[3][0]
  
          return resolve({wikiDescription: wikiDescription, wikiUrl: wikiUrl})
        } else {
          return resolve({wikiDescription: "", wikiUrl: ""})
        }
      })
    })
  }

  // when the place is selected, update the state and fetch the place details
  onPlaceSelected(place){
    let places = this.state.places;
    let filteredPlaces = this.state.filteredPlaces;
    this.setState({
      google: this.state.google,
      selectedPlace: place,
      selectedPlaceDetails: null,
      places: places,
      filteredPlaces: filteredPlaces,
      showingError: false,
      sidebarOpen: this.state.sidebarOpen
    });

    if(!place) {
      return
    }

    let detailsPromise = this.fetchDetails(place)
    let wikiPromise = this.fetchWiki(place)

    Promise.all([detailsPromise, wikiPromise]).then((values) => {
      let details = Object.assign({}, values[0], values[1]);
      this.setState({
        google: this.state.google,
        selectedPlace: place,
        selectedPlaceDetails: details,
        places: places,
        filteredPlaces: filteredPlaces,
        showingError: false,
        sidebarOpen: this.state.sidebarOpen
      });
    }).catch((error) => {
      console.log(error)
    })
  }

  onMenuClick() {
    this.setState((previousState) => {
      previousState.sidebarOpen = !previousState.sidebarOpen
      return previousState
    })
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <ResponsiveMenu sidebarOpen={this.state.sidebarOpen} onMenuClick={this.onMenuClick.bind(this)}/>
          <h1>London's Museums</h1>
        </header>
        <ListLocations 
          sidebarOpen={this.state.sidebarOpen}
          selectedPlace={this.state.selectedPlace}
          places={this.state.filteredPlaces} 
          onQueryChanged={this.updateQuery.bind(this)} 
          onPlaceSelected={this.onPlaceSelected.bind(this)} />
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
