import { action, makeObservable, observable } from "mobx";
import { message, Modal } from "antd";
import { eparse } from "../utils/eparse";
import firebase from "../global/firebase";
import auth from "./auth"
import likes from "./likes";

class User {
    @observable current = {}
    @observable emailToChange = null

    @action.bound set(data) {
        this.current = { ...this.current, ...data, }
    }

    @action.bound async delete() {
        await firebase.auth.currentUser.delete()
        await auth.logout()
    }

    @action.bound async editProfileInfo(body, _message, isCustomHandler) {
        const { currentUser, } = firebase.auth
        const { displayName, email, photoURL, } = body
        const { set, } = this
        let matchesCounter = 0

        if (photoURL) {
            await currentUser.updateProfile({ photoURL, })
            return this.set(currentUser)
        }

        if (displayName !== this.current.displayName && displayName) {
            await currentUser.updateProfile({ displayName, })
            set({ displayName, })
        }
        else {
            matchesCounter++
        }

        if (email !== this.current.email && email) {
            try {
                await currentUser.updateEmail(email)
                this.set({ email, })
            }
            catch (e) {
                this.emailToChange = email
                return auth.isRe = true
            }
        }
        else {
            matchesCounter++
        }

        if (matchesCounter >= 2) {
            // do nothing if data the same
            return
        }


        if (isCustomHandler) {
            // do nothing if custom handler
            return
        }

        message.success(_message || "The profile info has been successfully updated")

        console.log(this.current)
    }

    @action.bound async changeEmailWithReauth(password) {
        //TODO MAYBE: confirm user email
        try {
            if (this.emailToChange) {
                const { currentUser, } = firebase.auth
                let credential = firebase._auth.EmailAuthProvider.credential(
                    currentUser.email,
                    password
                )
                await currentUser.reauthenticateWithCredential(credential)
                await this.editProfileInfo({ email: this.emailToChange, })
                this.emailToChange = ""
                auth.isRe = false
            }
        }
        catch (e) {
            Modal.error({
                title: "Something wrong...",
                content: eparse(e),
            })
        }
    }

    @action.bound async clear(entity) {
        const niceForm = {
            likes: "likes",
            blackLists: "black list",
        }

        await firebase.db(`${entity}/${this.current.uid}`).remove()

        if (entity === "likes") {
            // rerender likes
            // prevention of persist
            likes.isLoaded = false
            likes.isLoaded = true
        }

        message.success(`Your ${niceForm[entity]} has been successfully cleared`)
    }

    @action.bound async updatePassword({ oldPassword, password, }) {
        const { currentUser, } = firebase.auth
        let credential = firebase._auth.EmailAuthProvider.credential(
            this.current.email,
            oldPassword
        )
        try {
            await currentUser.reauthenticateWithCredential(credential)
        }
        catch (e) {
            return Modal.error({
                title: "Something wrong...",
                content: "The old password does not match the entered one",
            })
        }

        if (password === oldPassword) {
            return Modal.warning({
                title: "Hmm...",
                content: "The new password is the same as the old one",
            })
        }

        await firebase.auth.currentUser.updatePassword(password)

        message.success("The password has been successfully updated")

    }
    constructor() {
        makeObservable(this)
    }

}

export default new User()
