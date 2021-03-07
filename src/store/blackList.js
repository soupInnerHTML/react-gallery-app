import { message } from "antd";
import { action, makeObservable, runInAction, observable, configure } from "mobx";
import auth from "./auth";
import feed from "./feed";
import likes from "./likes";
import user from "./user";
import _firebase from "../global/firebase";

configure({
    enforceActions: "never",
})

class BlackList {

    @observable _blackList = []

    @action.bound get() {
        return this._blackList
    }

    @action.bound async set(customId) {
        const data = await _firebase.db(`blackLists/${customId || user.current.uid}`).get()
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
            await _firebase.db(`blackLists/${user.current.uid}/${photo.idApi + +new Date}`).set(photo.idApi)
            await likes.deleteLike(photo)
            runInAction(() => photo.url = "")
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