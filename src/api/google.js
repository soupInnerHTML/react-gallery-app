import { Modal } from "antd";
import auth from "../store/auth";

export const gError = () => {
    console.error("some error with gapi")
}

//g(oogle)api is global scope var
export const gSignIn = async (fetcher) => {
    try {
        fetcher(true)
        const GoogleAuth = gapi.auth2.getAuthInstance()
        const user = await GoogleAuth.signIn({
            scope: "profile email",
        })

        const gUserData = {
            email: user.getBasicProfile().getEmail(),
            username: user.getBasicProfile().getName(),
            avatar: user.getBasicProfile().getImageUrl(),
            outer: true,
        }

        auth.login(gUserData)
        fetcher(false)
    }
    catch (e) {
        fetcher(true)
        gError()
        Modal.error({
            title: "Error",
            content: e.error.replace(/_/g, " "),
        })
    }
}

export const gAuth = () => {
    try {
        gapi.load("auth2", async () => {

            await gapi.auth2.init({
                // eslint-disable-next-line camelcase
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            })
            console.log("init OK")
        })
    }
    catch (e) {
        gError()
    }
}