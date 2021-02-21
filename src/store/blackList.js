import { message } from "antd";
import { action, makeObservable, runInAction, observable } from "mobx";
import { firebase } from "../api/firebase";
import { eparse } from "../utils/eparse";
import auth from "./auth";
import likes from "./likes";

class BlackList {

    @observable _blackList = []

    @action.bound get()  {
        return this._blackList
    }

    @action.bound async set() {
        const { data, } = await firebase.get(`blackLists/${auth.authState.id}.json`)
        if (data) {
            this._blackList = Object.values(data)
        }
    }

    @action.bound async addPhoto(photo) {
        try {
            await firebase.post(`blackLists/${auth.authState.id}.json`, photo.idApi)
            await likes.deleteLike(photo.name)
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