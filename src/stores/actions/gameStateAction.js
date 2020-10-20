import actionEnums from "../../enums/actionEnums"
import { dPattern } from "../../helpers/gameSnakeHelpers"


export const setBoarSize = (boardSize = 10) => ({
    type: actionEnums.GAME_STATE_SET_BOARD_SIZE, boardSize
})

export const setFoodPosition = (foodPosition = dPattern) => ({
    type: actionEnums.GAME_STATE_SET_FOOD_POSITION, foodPosition
})

export const setSnakePosition = (snakePosition = []) => ({
    type: actionEnums.GAME_STATE_SET_SNAKE_POSITION, snakePosition
})
