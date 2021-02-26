import { Modal } from "antd";
import { action, computed, makeObservable, observable } from "mobx";
import { sign } from "../global/inputData";
import { eparse } from "../utils/eparse";
import feed from "./feed";
import likes from "./likes";
import localUser from "./user";
import firebase from "../global/firebase";

class Auth {
    @observable isLoggedIn = !!localStorage.getItem("auth")
    @observable isLoggedOut = false
    @observable isModalVisible = false
    @observable signMode = "in"

    @computed get formTemplate() {
        return sign[this.signMode]
    }
    @computed get oppositeSignMode() {
        switch (this.signMode) {
            case "in":
                return "up"
            case "up":
            default:
                return "in"
        }
    }

    @action.bound openModal(flag = true ) {
        this.isModalVisible = flag
    }
    @action.bound changeSignMode(select) {
        this.signMode = select || this.oppositeSignMode
    }
    @action.bound async logout() {
        await firebase.auth.signOut()
        console.log("sign out")
        localStorage.removeItem("auth")
        this.isLoggedOut = true
        this.isLoggedIn = false
        localUser.set(null)
        // иначе остаются лайки после выхода
        feed.photos = feed.photos.map(photo => ({ ...photo, liked: false, }) )
    }

    check() {
        const { logout, isLoggedIn, } = this
        const storageId = localStorage.getItem("auth")
        firebase.auth.onAuthStateChanged(function(_user) {
            if (!isLoggedIn) {
                return
            }
            if (_user) {
                const { displayName, email, photoURL, uid, } = _user
                if (uid !== storageId) {
                    return logout()
                }
                localUser.set({
                    displayName, email, photoURL, uid,
                })
            } else {
                console.log("No user is signed in.")
                logout().then()
            }
        });
    }


    @action.bound async signProcessing(values, setFetching) {
        try {
            setFetching(true)
            const user = await this["sign" + this.signMode[0].toUpperCase() + this.signMode[1]](values)
            localUser.set(user)
            localStorage.setItem("auth", user.uid)
            setFetching(false)
            this.isLoggedIn = true
            this.openModal(false)
        }
        catch (e) {
            setFetching(false)
            Modal.error({
                title: "Error",
                content: eparse(e),
            })
        }
    }

    async signUp(body) {
        const { email, password, } = body
        const userCredential = await firebase.auth.createUserWithEmailAndPassword(email, password)
        const { user, } = userCredential
        await user.updateProfile({
            displayName: body["user name"],
        })
        const { displayName, uid, } = user
        return {
            email,
            displayName,
            uid,
            _password: password,
        }
    }

    async signIn({ email, password, }) {
        const userCredential = await firebase.auth.signInWithEmailAndPassword(email, password)
        const { displayName, photoURL, uid, } = userCredential.user
        likes.set(uid).then()
        return  {
            email,
            displayName,
            photoURL,
            uid,
            _password: password,
        }
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Auth()