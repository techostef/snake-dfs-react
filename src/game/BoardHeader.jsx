import React from "react"
import "./BoardHeader.scss"
import { Button } from 'react-bootstrap'
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameBusinessAction from "../stores/actions/business/gameBusinessAction"
import * as gameStateAction from "../stores/actions/gameStateAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import InputRange from "../components/inputs/InputRange"

const mapStateToProps = (state) => {
    return {
        startGame: state.appState.startGame,
        boardSize: state.gameState.boardSize
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        gameBusinessAction: bindActionCreators(gameBusinessAction, dispatch),
        gameStateAction: bindActionCreators(gameStateAction, dispatch),
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

    const onChangeBoardSize = (e) => {
        const { gameStateAction } = props
        gameStateAction.setBoarSize(e.target.value)
    }

    return (
        <div className="board-header">
            <div className="board-size-control">
                <div className="text-content">
                    Board Size
                </div>
                <InputRange 
                    disabled={props.startGame}
                    value={props.boardSize} 
                    min={3}
                    max={100}
                    onChange={onChangeBoardSize} 
                />
            </div>
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