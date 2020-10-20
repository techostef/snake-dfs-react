import React, { useEffect, useState } from "react"
import { range } from "../helpers/dataHelpers"
import { controlMove, generateGrid, movingSnake } from "../helpers/gameSnakeHelpers"
import "./BoardComponent.scss"
const BoardComponent = (props) => {
    const boardSize = 20
    const timerInterval = 100
    const [moveX, setMoveX] = useState(1)
    const [moveY, setMoveY] = useState(0)
    const styleBoardContainer = generateGrid(boardSize)

    const [snakePosition, setSnakePosition] = useState([
        {
            x: 4,
            y: 0,
        },
        {
            x: 3,
            y: 0,
        },
        {
            x: 2,
            y: 0,
        },
        {
            x: 1,
            y: 0,
        }
    ])

    const [foodPosition, setFoodPosition] = useState({
        x: boardSize - 5,
        y: 0,
    })
    
    useEffect(() => {
        let interval = setInterval(() => {
            movingSnake(snakePosition, moveX, moveY, foodPosition.x, foodPosition.y, boardSize, setSnakePosition, setFoodPosition)
        }, timerInterval)
        return () => {
            clearInterval(interval)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moveX, moveY, foodPosition.x, foodPosition.y, snakePosition])

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
                        ></div>
                    )
                })
            })}
        </div>
    )
}

export default React.memo(BoardComponent)