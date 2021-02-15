export default function compose (...fn) {
    return arg => fn.reduce( (callStack, current) => current(callStack), arg)
}