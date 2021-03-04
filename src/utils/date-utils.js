/**
 * @author wookjae.jo
 */

export const kst = (date: Date) => {
    return new Date(new Date(date) - 1000 * 60 * 60 * 9)
}


export const dateToString = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}


export const timeToString = (time: Date) => {
    return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
}

export const datetimeToString = (datetime: Date) => {
    return `${dateToString(datetime)} ${timeToString(datetime)}`
}