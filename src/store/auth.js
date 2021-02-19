import { message, Modal } from "antd";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { firebase } from "../api/firebase";
import bcrypt from "bcryptjs";
import { findKey, sample } from "lodash";
import { colorList } from "../components/global/styles";
import { eparse } from "../utils/eparse";

class Auth {
    // undefined = непоределенность
    // null = нет авторизации
    // {...} = есть авторизация
    @observable authState = undefined
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

    @action.bound async serverSync() {
        const userId = localStorage.getItem("auth")
        if (userId) {
            const { data, } = await firebase.get(`users/${userId}.json`)
            this.authState = { ...data, liked: Object.entries(data.liked || {}).map(
                entry => ({
                    ...entry[1],
                    name: entry[0],
                })
            ).reverse(), }

            this.isLoggedIn = true
        }
        else {
            this.authState = null
        }
    }
    @action.bound openModal(flag = true ) {
        this.isModalVisible = flag
    }
    @action.bound changeSignMode(select) {
        this.signMode = select || this.oppositeSignMode
    }
    @action.bound logout() {
        localStorage.removeItem("auth")
        this.isLoggedOut = true
        this.authState = null
        this.isLoggedIn = false
    }

    async fetchUsers() {
        const _res = await firebase.get("users.json")
        return _res
    }

    @action.bound async login(authData, isOuterAuth) {
        const _successAuth = (key) => {
            localStorage.setItem("auth", key)
            this.serverSync()
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
            return _successAuth(key)
        }

        if (!key) {
            _dataError()
        }

        const user = users.data[key]

        const isMatch = await bcrypt.compare(authData.password, user.password)

        if (isMatch) {
            _successAuth(key)

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

    @action.bound async addPhotoToBlackList(photo) {
        try {
            await firebase.post(`users/${this.authState.id}/blackList.json`, photo.idApi)
            runInAction(() => photo.url = "")
            message.success("The photo was successfully added to black list");
        }
        catch (e) {
            message.error(eparse(e));
        }
    }

    @action.bound async editProfileInfo(body) {
        const { data, } = await firebase.patch(`users/${this.authState.id}.json`, body)
        this.authState = { ...this.authState, ...data, }
    }

    @action.bound async updatePassword(body) {
        const { password, oldPassword, } = body

        const isOldMatch = await bcrypt.compare(oldPassword, this.authState.password)

        if (!isOldMatch) {
            return Modal.error({
                title: "Something wrong...",
                content: "The old password does not match the entered one",
            })
        }

        const isTheSame = await bcrypt.compare(password, this.authState.password)

        if (isTheSame) {
            return Modal.warning({
                title: "Hmm...",
                content: "The new password is the same as the old one",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await firebase.patch(`users/${this.authState.id}.json`, {
            password: hashedPassword,
        })

        return Modal.success({
            title: "Yeah, right",
            content: "The password successfully update",
        })
    }

    async addUser(body) {
        const hashedPassword = await bcrypt.hash(body.password, 12)

        const { email, } = body

        const user = {
            email,
            username: body["user name"],
            password: hashedPassword,
            color: sample(colorList),
        }

        const { data, } = await firebase.post("users.json", user)
        console.log("add user", data)
        await firebase.patch(`users/${data.name}.json`, { id: data.name, })
        this.login(body)
    }

    @action.bound async saveLike(photo) {
        const { url, bigV, id, } = photo

        const { data, } = await firebase.post(`users/${this.authState.id}/liked.json`, {
            url,
            bigV,
            liked: true,
            id,
        })
        await this.serverSync()

        return data
    }

    @action.bound async deleteLike(name) {
        const { id, } = this.authState


        await firebase.delete(`users/${id}/liked/${name}.json`)
        await this.serverSync()
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Auth()