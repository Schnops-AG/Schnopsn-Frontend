import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './playground.scss'

type PlayGroundProps = {
    
}

type PlayGroundState = {

}

export class Playground extends React.Component<PlayGroundProps, PlayGroundState> {
    constructor(props: PlayGroundProps){
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="playground">

                {/* Opponent */}
                <div className="opponent">
                    <div className="bummerl">
                        <h3>Bummerl:</h3>
                        <span>1:3</span>
                    </div>
                    
                </div>

                {/* Main Area (Center) */}
                <div className="central">
                    <h4>Central</h4>
                    <div className="points">
                        <div id="opponent" className="points">1</div>
                        <div id="own" className="points">3</div>
                    </div>
                    <div className="mainBoard"></div>
                    <div className="cardStack">
                        
                    </div>
                </div>


                {/* Own Card Area */}
                <div className="own">
                    <h4>own</h4>
                    <div className="playerName">Me</div>
                    <div className="ownCardBoard"></div>
                    <div className="tricks"></div>
                </div>

            </div>
        )
    }
}

