import { batch } from "react-redux"
import { dPattern, generateFoodPosition } from "../../../helpers/gameSnakeHelpers"
import * as gameStateAction from "../gameStateAction"

export const restartGame = () => {
    return (dispatch, getState) => {
        const state = getState()
        const { gameState } = state
        if (!gameState.startGame) {
            batch(() => {
                const generatedFoodPosition = generateFoodPosition([dPattern], gameState.boardSize)
                const snakePosition = [dPattern]
                dispatch(gameStateAction.setFoodPosition(generatedFoodPosition))
                dispatch(gameStateAction.setSnakePosition(snakePosition))
            })
        }
    }
}