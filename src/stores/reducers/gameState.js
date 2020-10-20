import actionEnums from "../../enums/actionEnums"
// import { dPattern } from "../../helpers/gameSnakeHelpers";

const init = {
    boardSize: 15,
    // foodPosition: Object.assign({}, dPattern, {x: 4, y: 4}),
    foodPosition: {
        "x": 5,
        "y": 5
    },
    // snakePosition: [dPattern],
    snakePosition: [
        {
          "x": 0,
          "y": 0
        }
    ],
}

const appState = (state = init, action) => {
    switch (action.type) {
        case actionEnums.GAME_STATE_SET_BOARD_SIZE:
            return Object.assign({}, state, { boardSize: action.boardSize})
        case actionEnums.GAME_STATE_SET_FOOD_POSITION:
            return Object.assign({}, state, { foodPosition: action.foodPosition})
        case actionEnums.GAME_STATE_SET_SNAKE_POSITION:
            return Object.assign({}, state, { snakePosition: action.snakePosition})
        default:
            return state;
    }
};

export default appState