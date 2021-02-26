import { action, makeObservable, observable } from "mobx";
import { message, Modal } from "antd";
import firebase from "firebase/app";
import auth from "./auth"

class User {
    @observable current = {}

    @action.bound set(data) {
        this.current = { ...this.current, ...data, }
    }

    @action.bound async delete() {
        await firebase.auth().currentUser.delete()
        await auth.logout()
    }

    @action.bound async editProfileInfo(body, _message, isCustomHandler) {
        const { currentUser, } = firebase.auth()
        await currentUser.updateProfile(body)

        this.set(currentUser)

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
        if (oldPassword !== this.current._password) {
            return Modal.error({
                title: "Something wrong...",
                content: "The old password does not match the entered one",
            })
        }

        if (password === this.current._password) {
            return Modal.warning({
                title: "Hmm...",
                content: "The new password is the same as the old one",
            })
        }

        await firebase.auth().currentUser.updatePassword(password)
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