import { message } from "antd";
import { action, makeObservable, runInAction, observable, configure } from "mobx";
import auth from "./auth";
import feed from "./feed";
import likes from "./likes";
import user from "./user";
import firebase from "../global/firebase";

configure({
    enforceActions: "never",
})

class BlackList {

    @observable _blackList = []

    get() {
        return this._blackList
    }

    @action.bound observer(userId) {
        if (userId) {
            firebase.db(`blackLists/${userId}`)
                .on("value", (snapshot) => {
                    const data = Object.values(snapshot.val() || {})
                    this._blackList = data
                })
        }
    }

    @action.bound async set(customId) {
        const data = await firebase.db(`blackLists/${customId || user.current.uid}`).get()
        if (data.val()) {
            this._blackList = Object.values(data.val())
            feed.photos = feed.photos.filter(photo => !this._blackList.includes(photo.idApi))
        }
    }

    @action.bound async addPhoto(photo) {
        try {
            if (!auth.isLoggedIn) {
                return auth.openModal()
            }

            await firebase.db(`blackLists/${user.current.uid}/${photo.idApi + +new Date}`).set(photo.idApi)
            await likes.deleteLike(photo)
            message.success("The photo was successfully added to black list");
        }
        catch (e) {
            message.error(e)
        }
    }

    constructor() {
        makeObservable(this)
    }

}

export default new BlackList()
