import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './playground.scss'
import Board from '../../components/Board/Board'

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
                <div className="back">

                    <div className="bummerl">
                        <h3>Bummerl</h3>
                        <span>1:3</span>
                    </div>

                    {/* Opponent */}
                    <div className="opponent">
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                    </div>


                    <div className="points">
                        <h3>Spielstand</h3>
                        <span>1</span>
                        <span>3</span>
                    </div>

                    {/* Main Area (Center) */}
                    <main className="main">
                        <div className="central">
                            <Board id="middle" className="board">
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                            </Board>
                        </div>

                        {/* Own Card Area */}
                        <div className="own">
                            <Board id="own" className="board">
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                            </Board>
                        </div>
                    </main>
                    
                </div>

                

            </div>
        )
    }
}

