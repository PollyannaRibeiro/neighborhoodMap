import React, { Component } from 'react'
import { Slider } from 'react-burgers'
import PropTypes from 'prop-types'

class ListLocations extends Component {

    static propTypes = {
        selectedPlace: PropTypes.object,
        places: PropTypes.array.isRequired,
        onQueryChanged: PropTypes.func.isRequired,
        onPlaceSelected: PropTypes.func.isRequired
    }

    state = {
        query: '',
    }

    onItemClick(event, place){
        this.props.onPlaceSelected(place);
    }

    updateQuery(query) {
        this.setState({
            query: query,
        });
        this.props.onQueryChanged(query);
    }

    render(){
    
        let places = this.props.places;

        return(
            <div className="sidebar">

                <div className='search-locations-bar'>
                    <div className='search-locations-input-wrapper'>
                        <input 
                        type="text" 
                        placeholder="Search by museum name" 
                        value={this.state.query}
                        onChange={(event) => this.updateQuery(event.target.value)}/>
                    </div>
                </div>  
                
                <div className="search-locations-results">
                    <ul className='locations-list'>
                        {places.map((place)=>(
                            <li className="list" key={place.id}  onClick={(event)=>this.onItemClick(event, place)}>
                                <div className="list-container">
                                    <div className={ this.props.selectedPlace && place.id === this.props.selectedPlace.id ? "list-selected-title" : "list-title"}>
                                        {place.name}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>   
            </div>       
        )
    }
}

export default ListLocations