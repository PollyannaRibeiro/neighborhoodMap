import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends Component {

    static propTypes = {
        selectedPlace: PropTypes.object,
        selectedPlaceDetails: PropTypes.object,
        places: PropTypes.array.isRequired,
        onMapLoaded: PropTypes.func.isRequired,
        onPlaceSelected: PropTypes.func.isRequired
    }
    
    markers;

    state = {
        mapProps: null,
        map: null
    }

    // when the map is loaded, configures properties and send mapProps and to the parent component
    onMapReady(mapProps, map){
        this.setState({mapProps: mapProps, map: map})
        this.props.onMapLoaded(mapProps, map);
    }

    onMarkerClick(place) {
        this.props.onPlaceSelected(place);
    }
    
    // to close the infoWindow
    onMapClicked() {
        if (this.props.selectedPlace) {
            this.props.onPlaceSelected(null);
        }
    }

    render(){
        let places = this.props.places
        let selectedPlace = this.props.selectedPlace
        let selectedPlaceName = selectedPlace ? selectedPlace.name : ""
        let selectedMaker = null

        // if the map is configured add the markers
        if (this.state.mapProps) {
            const {google} = this.state.mapProps;
            let map = this.state.map;

            // remove previous markers
            if (this.markers) {
                this.markers.forEach((marker)=>{
                    marker.setMap(null);
                })    
            }
            
            this.markers = places.map((place) => {
                let marker = new google.maps.Marker({
                    position: place.geometry.location,
                    title: place.name,
                    name: place.name
                });

                marker.setMap(map);
                marker.addListener('click', ()=>{this.onMarkerClick(place)});

                if (selectedPlace && place.id === selectedPlace.id) {
                    selectedMaker = marker
                }

                return marker
            });
        }
        const prop = this.props.selectedPlaceDetails
        let phone = ""
        let address = ""
        let photo = ""

        if (prop) {
            phone = prop.formatted_phone_number
            address = prop.formatted_address
            
            // if there is any picture dispplays the first one
            if (prop.photos && prop.photos.length > 0){
                photo = prop.photos[0].getUrl()
            }
        }

        return (
            <Map className= "map"
                google={this.props.google}
                zoom={15}
                initialCenter={{
                    lat: 51.51,
                    lng: -0.11
                }} 
                onClick={this.onMapClicked.bind(this)}
                onReady={this.onMapReady.bind(this)}>
                <InfoWindow
                    marker={selectedMaker}
                    visible={selectedMaker != null}>
                    <div>
                        <h2>{selectedPlaceName}</h2>
                        { this.props.selectedPlaceDetails && 
                            <div className="museum-info">
                                <p>Rating: {this.props.selectedPlaceDetails.rating}</p>
                                <p>Phone: {phone}</p>
                                <p>Address: {address}</p>
                                <img className="museum-img" src= {photo} width="400" alt={selectedPlaceName}/>
                            </div>
                        }
                    </div>
                </InfoWindow>       
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyCBp9p14TKgr-Zlq4aNz6ZRxCsusD7hR6Q")
})(MapContainer)