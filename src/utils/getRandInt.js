export default function getRandInt (max, min = 0) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1))
}