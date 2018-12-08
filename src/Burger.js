import React, { Component } from 'react'
import { Slider } from 'react-burgers'

class ResponsiveMenu extends Component{

    state = {
        open: true
    }

    render(){
        return(
            
            <Slider onClick="this.update()"
                color='#a2a2a2'
                borderRadius={7}
                padding='10px' />
        )
    }
}

export default ResponsiveMenu;