import React from "react"
import "./BoardHeader.scss"
import { Button } from 'react-bootstrap'
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameBusinessAction from "../stores/actions/business/gameBusinessAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

const mapStateToProps = (state) => {
    return {
        startGame: state.appState.startGame
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        gameBusinessAction: bindActionCreators(gameBusinessAction, dispatch),
    }
}

const BoardHeader = (props) => {
    const startStopGame = () => {
        const { appStateAction, startGame } = props
        appStateAction.setStartGame(!startGame)
    }

    const restartGame = () => {
        const { gameBusinessAction, startGame } = props
        if (!startGame) {
            gameBusinessAction.restartGame()
        }
    }

    return (
        <div className="board-header">
            <Button 
                className="start-button" 
                onClick={startStopGame}
            >
                {props.startGame ? "Stop" : "Start"}
            </Button>
            <Button 
                disabled={props.startGame}
                className="restart-button" 
                onClick={restartGame}
            >
                Restart Game
            </Button>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardHeader))