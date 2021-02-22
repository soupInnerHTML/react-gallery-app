import { Modal } from "antd";
import { action, computed, makeObservable, observable } from "mobx";
import { eparse } from "../utils/eparse";
import firebase from "firebase";
import feed from "./feed";
import likes from "./likes";
import localUser from "./user";

class Auth {
    @observable isLoggedIn = !!localStorage.getItem("auth")
    @observable isLoggedOut = false
    @observable isModalVisible = false
    @observable signMode = "in"
    @observable required = {
        required: true,
        message: "",
    }
    @observable sign = {
        in: {
            fields: [{
                label: "Email",
                placeholder: "example@example.com",
                rules: [
                    this.required
                ],
            },
            {
                label: "Password",
                placeholder: "••••••••",
                rules: [
                    this.required
                ],
            }],
            switchText: "Doesn't have an account? Sign up or",
        },

        up: {
            fields: [{
                label: "Email",
                placeholder: "example@example.com",
                rules: [
                    this.required,
                    {
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email is incorrect",
                    }
                ],
            },
            {
                label: "User name",
                placeholder: "Elon Musk",
                rules: [
                    this.required
                ],
            },
            {
                label: "Password",
                placeholder: "••••••••",
                rules: [
                    this.required,
                    {
                        min: 8,
                        message: "Minimum password length is 8 chars",
                    }
                ],
            },
            {
                label: "Repeat password",
                placeholder: "••••••••",
                dependencies: ["password"],
                rules: [
                    this.required,
                    ({ getFieldValue, }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject("The two passwords that you entered do not match!");
                        },
                    })
                ],
            }],
            switchText: "Already have an account? Just sign in or",
        },
    }

    @computed get formTemplate() {
        return this.sign[this.signMode]
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
        await firebase.auth().signOut()
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
        firebase.auth().onAuthStateChanged(function(_user) {
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
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)
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
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
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