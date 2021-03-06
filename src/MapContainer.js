import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import wiki from './icon_Wikipedia.png'

class MapContainer extends Component {

    static propTypes = {
        selectedPlace: PropTypes.object,
        selectedPlaceDetails: PropTypes.object,
        places: PropTypes.array.isRequired,
        onMapLoaded: PropTypes.func.isRequired,
        onPlaceSelected: PropTypes.func.isRequired
    }
    
    markers = {};

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
        let selectedPlaceDetails = this.props.selectedPlaceDetails
        let selectedPlaceName = selectedPlace ? selectedPlace.name : ""
        let selectedMaker = null

        // if the map is configured add the markers
        if (this.state.mapProps) {
            const {google} = this.state.mapProps;
            let map = this.state.map;

            let markersIds = new Set(Object.keys(this.markers));

            places.forEach((place) => {
                let marker = this.markers[place.id]

                if (!marker){
                    // create maker
                    let marker = new google.maps.Marker({
                        position: place.geometry.location,
                        title: place.name,
                        name: place.name,
                        animation: google.maps.Animation.DROP
                    });
    
                    marker.setMap(map);
                    marker.addListener('click', ()=>{this.onMarkerClick(place)});

                    this.markers[place.id] = marker
                }

                markersIds.delete(place.id)

                if (selectedPlace && place.id === selectedPlace.id) {
                    selectedMaker = marker

                    if (selectedPlaceDetails) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }
                
                return marker
            });

            // remove unused ids
            markersIds.forEach((key)=>{
                this.markers[key].setMap(null)
                delete this.markers[key]
            })
        }

        let imgSrc = null

        // if there is any picture displays the first one
        if (selectedPlaceDetails && selectedPlaceDetails.photos && selectedPlaceDetails.photos.length > 0) {
            imgSrc = selectedPlaceDetails.photos[0].getUrl()
        }

        return (
            <Map className= "map" role="application" tabindex="1"
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
                    visible={selectedPlaceDetails != null}>
                    <div>
                        <h2>{selectedPlaceName}</h2>
                        { selectedPlaceDetails && 
                            <div className="museum-info">
                                { selectedPlaceDetails.rating && 
                                    <p>Rating: {selectedPlaceDetails.rating}</p>
                                }
                                { selectedPlaceDetails.wikiUrl &&
                                    <a href={selectedPlaceDetails.wikiUrl}><img src={wiki} alt="Wikipedia" className="wikipedia-logo"/></a>
                                }
                                { selectedPlaceDetails.formatted_phone_number && 
                                    <p>Phone: {selectedPlaceDetails.formatted_phone_number}</p>
                                }
                                <p>Address: {selectedPlaceDetails.formatted_address}</p>
                                { imgSrc && 
                                    <img className="museum-img" src= {imgSrc} width="400" alt={selectedPlaceName}/>
                                }
                                <p>{selectedPlaceDetails.wikiDescription}</p>
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