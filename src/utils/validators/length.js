export function length(value, len, flag) {
    switch (flag) {
        case "MAX": return value.length >= len && `Max length is ${len}`
        case "MIN": return value.length <= len && `Min length is ${len}`
        default: return false
    }
}