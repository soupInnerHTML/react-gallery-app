// this function can parse errors by different flags
// [0] => replacer
// [1] => replacement

export function eparse(error) {
    const flags =  [
        ["Error: ", ""],
        [" or the user does not have a password", ". Please, try again"],
        ["the password", "Entered password or email"]
    ]

    return flags.reduce((str, flag) => {
        return str.replace(RegExp(flag[0], "gi"), flag[1])
    }, error.toString())
}
eparse("Error: The password is invalid or the user does not have a password.") //?
