import { Modal } from "antd";
import { sample } from "lodash";
import { action, computed, makeObservable, observable } from "mobx";
import { sign } from "../global/inputData";
import { colorList } from "../global/styles";
import blackList from "./blackList";
import feed from "./feed";
import likes from "./likes";
import localUser from "./user";
import firebase from "../global/firebase";

class Auth {
    @observable isLoggedIn = !!localStorage.getItem("auth")
    @observable isLoggedOut = false
    @observable isModalVisible = false
    @observable signMode = "in"
    @observable outer = false

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
        //otherwise there are likes after logout
        feed.photos = feed.photos.map(photo => ({ ...photo, liked: false, }) )
    }

    check() {
        const { logout, isLoggedIn, } = this
        const storageId = localStorage.getItem("auth")

        //subscribe to likes from user by storage id
        likes.observer(storageId)
        blackList.set(storageId).then()

        firebase.auth.onAuthStateChanged(function(_user) {
            if (!isLoggedIn) {
                return
            }
            if (_user) {
                // console.log(_user)
                const { displayName, email, photoURL, uid, providerData, } = _user
                if (uid !== storageId) {
                    return logout()
                }
                localUser.set({
                    displayName, email, photoURL, uid,
                    outer: providerData[0].providerId,
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
            const user = await this[this.outer ? this.outer + "SignIn" : "sign" + this.signMode[0].toUpperCase() + this.signMode[1]](values)
            // console.log(user)
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
                content: e,
            })
        }
    }

    async signUp(body) {
        const { email, password, } = body
        const userCredential = await firebase.auth.createUserWithEmailAndPassword(email, password)
        const { user, } = userCredential
        await user.updateProfile({
            displayName: body["user name"],
            photoURL: sample(colorList),
        })

        return await this.signIn(body)
    }

    async signIn({ email, password, }) {
        const userCredential = await firebase.auth.signInWithEmailAndPassword(email, password)
        const { displayName, photoURL, uid, } = userCredential.user
        return  {
            email,
            displayName,
            photoURL,
            uid,
            _password: password,
        }
    }

    async googleSignIn() {
        let provider = new firebase._auth.GoogleAuthProvider()
        const data = await firebase.auth.signInWithPopup(provider)
        const { displayName, photoURL, uid, email, providerData, } = data.user
        return {
            displayName, photoURL, uid, email,
            outer: providerData[0].providerId,
        }
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Auth()

//TODO remove password from store