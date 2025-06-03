// Replace with your new API key
export const API_KEY = 'AIzaSyDlOF9XYEIG24Fk7LL6p-i6nt3EpPwROhY'

export const value_converter = (value) => {
    if(value >= 1000000000) {
        return Math.floor(value / 1000000000) + 'B'
    }   
    else if(value >= 1000000) {
        return Math.floor(value / 1000000) + 'M'
    }   
    else if(value >= 1000) {
        return Math.floor(value / 1000) + 'K'
    }   
    else {
        return value
    }
}