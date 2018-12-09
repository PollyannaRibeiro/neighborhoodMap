import React, { Component } from 'react'
import { Slider } from 'react-burgers'
import PropTypes from 'prop-types'

class ResponsiveMenu extends Component{

    static propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        onMenuClick: PropTypes.func.isRequired
    }

    render(){

        let color = this.props.sidebarOpen ? '#ffffff' : '#a2a2a2';

        return(
            <Slider onClick={this.props.onMenuClick}
                color={color}
                borderRadius={7}
                padding='10px' />
        )
    }
}

export default ResponsiveMenu;