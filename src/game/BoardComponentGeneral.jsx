import React, { useEffect, useState } from "react"
import { range } from "../helpers/dataHelpers"
import { checkEatTarget, controlMove, doEatFood, generateGrid, dPattern, gapPattern, followingHeader, checkEatBody, moveNext, generateFoodPosition, getMoveExcept, patternToString, indexOfPattern, followingTail } from "../helpers/gameSnakeHelpers"
import * as appStateAction from "../stores/actions/appStateAction"
import * as gameStateAction from "../stores/actions/gameStateAction"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import "./BoardComponent.scss"

const mapStateToProps = (state) => {
    return {
        boardSize: state.gameState.boardSize,
        foodPosition: state.gameState.foodPosition,
        snakePosition: state.gameState.snakePosition,
        startGame: state.appState.startGame,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        appStateAction: bindActionCreators(appStateAction, dispatch),
        gameStateAction: bindActionCreators(gameStateAction, dispatch),
    }
}

const BoardComponent = (props) => {
    const [boardSize, setBoardSize] = useState(props.boardSize)
    const timerInterval = props.timerInterval
    const [moveX, setMoveX] = useState(1)
    const [moveY, setMoveY] = useState(0)
    const [history, setHistory] = useState([])
    const [levelEat, setLevelEat] = useState(0)
    const styleBoardContainer = generateGrid(boardSize)

    const [snakePosition, setSnakePosition] = useState(props.snakePosition)

    const [foodPosition, setFoodPosition] = useState(props.foodPosition)

    useEffect(() => {
        let obj = {
            startGame: true,
            snakePosition: props.snakePosition,
            foodPosition: props.foodPosition,
        }
        if (props.startGame) {
            dfsStep(obj)
        }
        
        return () => {
            obj.startGame = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.startGame, levelEat])

    useEffect(() => {
        if (!props.startGame) {
            setBoardSize(props.boardSize)
            setSnakePosition([dPattern])
            setFoodPosition(generateFoodPosition([dPattern], props.boardSize))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.boardSize])

    useEffect(() => {
        if (!props.startGame) {
            setFoodPosition(props.foodPosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.foodPosition])

    useEffect(() => {
        if (!props.startGame) {
            setSnakePosition(props.snakePosition)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.snakePosition])

    const snakePositionForRender = [...snakePosition]

    const checkPositionSnake = ( positionX = 0, positionY = 0, result = 'active') => {
        if (snakePositionForRender.length === 0) return false
        let check = false
        for (let i = 0; i < snakePositionForRender.length; i ++) {
            if (check !== false) break
            if (positionX === snakePositionForRender[i].x && positionY === snakePositionForRender[i].y) check = i
        }
        if (check !== false) {
            if (snakePosition[0].x === snakePositionForRender[check].x && snakePosition[0].y === snakePositionForRender[check].y)
                result =  result + 'Head'
            snakePositionForRender.splice(check, 1)
            return result
        } else {
            return ""
        }
    }


    const dfsStep = (data) => {
        
        let interval
        let step = []
        let visited = []
        let move = dPattern
        let moveAll = []
        let snakePositionTemp = data.snakePosition.map((item) => Object.assign({}, item))
        let snakePositionOriginal = data.snakePosition.map((item) => Object.assign({}, item))
        let foodPositionTemp = {...foodPosition}
        let historyTemp = [...history]
        let eatFood = false
        let nextStep
        let allStep = []
        let currentPosition 
        // ----------------------------------------------------

        const setSnakePositionTemp = (data) => snakePositionTemp = data
        const setSnakePositionOriginal = (data) => snakePositionOriginal = data
        const setFoodPositionTemp = (data) => foodPositionTemp = data
        const prevStep = () => {
            const movingPrev = moveAll.pop()
            followingTail(movingPrev, snakePositionTemp, boardSize, setSnakePositionTemp)
            step.pop()
        }

        while (!eatFood) {
            currentPosition = patternToString(snakePositionTemp[0])
            if (!visited[currentPosition]) {
                visited[currentPosition] = []
                nextStep = moveNext(snakePositionTemp[0], foodPositionTemp, snakePositionTemp, boardSize)
            } else {
                if (visited[currentPosition].length === 4) {
                    prevStep()
                    continue
                }
                nextStep = getMoveExcept(visited[currentPosition], snakePositionTemp[0])
                if (!nextStep) {
                    prevStep()
                    continue
                }

            }
            visited[currentPosition].push(Object.assign({}, nextStep))
            
            // console.log("indexOfPattern", nextStep, [...snakePositionTemp])
            if (indexOfPattern(nextStep, snakePositionTemp) >= 0) {
                continue
            }
            move = gapPattern(snakePositionTemp[0], nextStep)
            moveAll.push(Object.assign({}, move))
            step.push(nextStep)
            allStep.push([...step].map((item) => Object.assign({}, item)))
            followingHeader(nextStep, snakePositionTemp, boardSize, setSnakePositionTemp)
            
            if (checkEatTarget(snakePositionTemp, foodPositionTemp)) {
                eatFood = true
                continue
            }
        }

        // console.log("failed ?", failed, JSON.stringify(step))
        // console.log("allStep ?", JSON.stringify(allStep))
        const { gameStateAction } = props

        const setDefault = () => {
            const newSnake = [...snakePositionOriginal]
            const newFood = {...foodPositionTemp}
            if (historyTemp.length > 5) historyTemp.shift()
            setHistory([...historyTemp, {
                snakePosition: newSnake,
                foodPosition: newFood,
            }])
            console.log(`history`, JSON.stringify(historyTemp))
            setSnakePosition(newSnake)
            setFoodPosition(newFood)
            gameStateAction.setSnakePosition(newSnake)
            gameStateAction.setFoodPosition(newFood)
            setLevelEat(levelEat + 1)
        }

        interval = setInterval(() => {
            if (data.startGame === false) {
                clearInterval(interval)
                setDefault()
                console.log("snakePosition", JSON.stringify([...snakePositionOriginal]), JSON.stringify(foodPositionTemp))
                return 
            }
            const [ movingNext ] = step
            step.shift()

            if (movingNext) {
                followingHeader(movingNext, snakePositionOriginal, boardSize, setSnakePositionOriginal)
                setSnakePosition([...snakePositionOriginal])
                if (checkEatBody(snakePositionOriginal)) {
                    clearInterval(interval)
                    setDefault()
                }
            }
            if (step.length === 0) {
               
                clearInterval(interval)
                doEatFood(snakePositionOriginal, move, boardSize, setFoodPositionTemp, setSnakePositionOriginal)
                setDefault()
            }
        }, timerInterval)
    }

    const checkPositionFood = ( positionX = 0, positionY = 0, result = 'foodActive') => {
        let check = false
        if (positionX === foodPosition.x && positionY === foodPosition.y) {
            check = true
        }
        if (check !== false) {
            return result
        } else {
            return ""
        }
    }

    return (
        <div 
            onKeyDown={(e) => controlMove(e, moveX, moveY, setMoveX, setMoveY)}
            className="board-component-container" 
            style={styleBoardContainer}
            tabIndex="0"
        >
            {range(boardSize).map((indexY) => {
                return range(boardSize).map((indexX) => {
                    return (
                        <div
                            key={`board-item-${indexX}-${indexY}`} 
                            className={`board-item ${checkPositionSnake(indexX, indexY)} ${checkPositionFood(indexX, indexY)}`}
                        >
                            {/* <div>x: {indexX}</div>
                            <div>y: {indexY}</div> */}
                        </div>
                    )
                })
            })}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(BoardComponent))