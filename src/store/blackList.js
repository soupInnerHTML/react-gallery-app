import { message } from "antd";
import { action, makeObservable, runInAction, observable, configure } from "mobx";
import { db } from "../api/firebase";
import { eparse } from "../utils/eparse";
import auth from "./auth";
import likes from "./likes";
import user from "./user";

configure({
    enforceActions: "never",
})

class BlackList {

    @observable _blackList = []

    @action.bound get()  {
        return this._blackList
    }

    @action.bound async set(customId) {
        const { data, } = await db.get(`blackLists/${customId || user.current.uid}.json`)
        if (data) {
            this._blackList = Object.values(data)
        }
    }

    @action.bound async addPhoto(photo) {
        try {
            if (!auth.isLoggedIn) {
                return auth.openModal()
            }
            await db.post(`blackLists/${user.current.uid}.json`, photo.idApi)
            await likes.deleteLike(photo)
            runInAction(() => photo.url = "")
            message.success("The photo was successfully added to black list");
        }
        catch (e) {
            message.error(eparse(e));
        }
    }

    constructor() {
        makeObservable(this)
    }

}

export default new BlackList()