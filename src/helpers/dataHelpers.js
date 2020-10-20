export const range = (start = 0, end = 0, increment = 1) => {
    let array = []
    if (!end) {
        for(let i = 0; i < start; i++) {
            array.push(i)
        }
    } else if (end !== 0) {
        for(let i = start; i < end; i++) {
            array.push(i)
        }
    }

    return array
}

export const last = (obj = []) => {
    if (obj.length === 0) return null
    return obj[obj.length - 1]
}

export const arrayToString = (array = []) => {
    let result = ""
    array.forEach((item) => result += item)
    return result
}