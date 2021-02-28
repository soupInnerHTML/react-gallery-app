import { action, makeObservable, observable } from "mobx";
import { message, Modal } from "antd";
import firebase from "../global/firebase";
import auth from "./auth"

class User {
    @observable current = {}

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
        let matchesCounter = 0
        console.log(this.current._password)

        if (photoURL) {
            await currentUser.updateProfile({ photoURL, })
            return this.set(currentUser)
        }

        if (displayName !== this.current.displayName) {
            await currentUser.updateProfile({ displayName, })
        }
        else {
            matchesCounter++
        }

        if (email !==  this.current.email) {
            // let credential = firebase._auth.EmailAuthProvider.credential(
            //     this.current.email,
            //     this.current._password
            // )
            // await currentUser.reauthenticateWithCredential(credential)
            await currentUser.updateEmail(email)
        }
        else {
            matchesCounter++
        }

        if (matchesCounter >= 2) {
            return Modal.warning({
                title: "Oh...",
                content: "The profile data the same",
            })
        }


        if (isCustomHandler) {
            return
        }

        if (_message) {
            return message.success(_message)
        }

        Modal.success({
            title: "It's alright",
            content: "The profile info has been successfully updated",
        })
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
        return Modal.success({
            title: "Yeah, right",
            content: "The password has been successfully updated",
        })

    }
    constructor() {
        makeObservable(this)
    }

}

export default new User()