import { action, makeObservable, observable, runInAction } from "mobx";
import feed from "./feed";
import user from "./user";
import firebase from "../global/firebase";

class Likes {

    @observable _likes = []
    @observable isLoaded = false

    get = () => {
        return this._likes
    }

    @action.bound observer(userId) {
        if (userId) {
            firebase.db(`likes/${userId}`)
                .orderByChild("timestamp")
                .on("value", (snapshot) => {
                    const data = snapshot.val()
                    this.set(data).then()
                })
        }
    }

    @action.bound async set(data) {
        this._likes = Object.entries(data || {}).map(
            entry => ({
                ...entry[1],
                liked: true,
                id: entry[0],
            })
        ).reverse()

        this.isLoaded = true

        feed.syncLikes()
    }

    @action.bound async saveLike(photo) {
        const { url, bigV, id, idApi, height, } = photo
        await firebase.db(`likes/${user.current.uid}/${id}`).set({
            url,
            bigV,
            idApi,
            height,
        })

    }

    @action.bound async deleteLike(photo) {
        photo.liked = false
        await firebase.db(`likes/${user.current.uid}/${photo.id}`).remove()
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Likes()
