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
import { eparse } from "../utils/eparse";
import user from "./user";

class Auth {
    @observable isLoggedIn = !!localStorage.getItem("auth")
    @observable isLoggedOut = false
    @observable isModalVisible = false
    @observable isRe = false
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

    @action.bound openModal(flag = true) {
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
        user.current = []
        localUser.set(null)

        //remove likes after logout
        if (feed.photos.length) {
            feed.photos = feed.photos.map(photo => ({ ...photo, liked: false, }))
        }
        if (feed.cachedPhotos.length) {
            feed.cachedPhotos = feed.cachedPhotos.map(photo => ({ ...photo, liked: false, }))
        }
    }

    check() {
        const getSID = () => localStorage.getItem("auth")

        firebase.auth.onAuthStateChanged(_user => {
            if (_user) {
                const { displayName, email, photoURL, uid, providerData, } = _user
                if (this.isLoggedIn && uid !== getSID()) {
                    console.log("exit", "sid: " + getSID(), "uid: " + uid)
                    return this.logout()
                }
                localUser.set({
                    displayName, email, photoURL, uid,
                    outer: providerData[0].providerId !== "password",
                    // google.com & etc -> true
                    // by password -> false
                })

                localStorage.setItem("auth", uid)
                this.isLoggedIn = true

                //subscribe to likes from user by storage id
                likes.observer(uid)
                blackList.set(uid)

                console.log("wellcome")
            } else {
                console.log("No user is signed in")
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
            photoURL: sample(colorList),
        })

        return await this.signIn(body)
    }

    async signIn({ email, password, }) {
        const userCredential = await firebase.auth.signInWithEmailAndPassword(email, password)
        const { displayName, photoURL, uid, } = userCredential.user
        return {
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