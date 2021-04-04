import { action, makeObservable, observable } from "mobx";
import feed from "./feed";
import user from "./user";
import auth from "./auth";
import firebase from "../global/firebase";

class Likes {

    @observable _likes = []
    @observable isLoaded = false

    get = () => {
        return this._likes
    }
    @action.bound observe() {
        const { uid, } = user.common || { uid: auth.getSID(), }
        if (uid) {
            firebase.db(`likes/${uid}`)
                .orderByChild("timestamp")
                .on("value", (snapshot) => {
                    const data = snapshot.val()
                    this.set(data).then()
                    //TODO remove warning in WS for promises w/out .then()
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
        photo.liked = true
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
