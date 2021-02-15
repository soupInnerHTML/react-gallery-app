import { action, computed, makeObservable, observable } from "mobx";
import { firebase } from "../api/firebase";
import bcrypt from "bcryptjs";
import { findKey, uniqueId } from "lodash";

class Auth {
    // undefined = непоределенность
    // null = нет авторизации
    // {...} = есть авторизация
    @observable authState = undefined
    @observable isLoggedOut = false
    @observable isModalVisible = false
    @observable signMode = "in"
    @observable sign = {
        in: {
            fields: [{
                label: "Email",
                placeholder: "",
            },
            {
                label: "Password",
                placeholder: "",
            }],
            switchText: "Doesn't have an account? Sign up or",
        },

        up: {
            fields: [{
                label: "Email",
                placeholder: "",
            },
            {
                label: "User name",
                placeholder: "",
            },
            {
                label: "Password",
                placeholder: "",
            },
            {
                label: "Repeat password",
                placeholder: "",
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
    @action.bound stateSync() {
        this.authState = JSON.parse(localStorage.getItem("auth"))
    }
    @action.bound logout() {
        localStorage.removeItem("auth")
        this.isLoggedOut = true
        this.stateSync()
    }

    async fetchUsers() {
        const _res = await firebase.get("users.json")
        return _res
    }
    storageSync() {
        localStorage.setItem("auth", JSON.stringify(this.authState))
    }

    @action.bound async login(authData, isOuterAuth) {
        const _successAuth = (data) => {
            this.authState = data
            this.storageSync()
            this.openModal(false)
        }

        const _dataError = () => {
            //без if не будет работать
            if (true) {
                throw new Error("Wrong login or password")
            }
        }


        const users = await this.fetchUsers()

        let key = findKey(users.data, user => user.email === authData.email)

        if (authData && authData.outer) {
            if (!key) {
                let oUser = await firebase.post("users.json", authData)
                key = oUser.data.name
            }
            return _successAuth({ ...authData, id: key, })
        }

        if (!key) {
            _dataError()
        }

        const user = users.data[key]

        const isMatch = await bcrypt.compare(authData.password, user.password)

        if (isMatch) {
            _successAuth({ ...user, id: key, })

            return user
        }
        else {
            _dataError()
        }
    }
    @action.bound async deleteProfile() {
        await firebase.delete(`users/${this.authState.id}.json`)
        this.logout()
    }

    async addUser(body) {
        const hashedPassword = await bcrypt.hash(body.password, 12)

        const { email, } = body

        const user = {
            email,
            username: body["user name"],
            password: hashedPassword,
        }

        const { data, } = await firebase.post("users.json", user)
        console.log("add user", data)
        this.login(body)
    }

    @action.bound async saveLike(photo) {
        const { id, } = this.authState
        const { url, bigV, } = photo
        const _res = await firebase.put(`users/${id}.json`, {
            ...this.authState,
            liked: [...(this.authState.liked ?? []), {
                url,
                bigV,
                liked: true,
                id: +new Date + uniqueId(), //timestamp +
            }],
        })

        this.authState = _res.data
        this.storageSync()
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Auth()