import { action, makeObservable, observable, runInAction } from "mobx";
import feed from "./feed";
import user from "./user";
import _firebase from "../global/firebase";

class Likes {

    @observable _likes = []
    @observable isLoaded = false

    get = () => {
        return this._likes
    }

    observer(userId) {
        if (userId) {
            _firebase.db(`likes/${userId || localStorage.getItem("auth")}`)
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

        feed.photos = feed.photos.map(photo => ({
            ...photo,
            liked: !!this._likes.find(x => x.idApi === photo.idApi),
        }))
    }

    @action.bound async saveLike(photo) {
        const { url, bigV, id, idApi, height, } = photo
        await _firebase.db(`likes/${user.current.uid}/${id}`).set({
            url,
            bigV,
            idApi,
            height,
        })

    }

    @action.bound deleteLike(photo) {
        photo.liked = false
        //remove like from feed | cache
        let feedPhoto = (feed.photos.length ? feed.photos : feed.cachedPhotos).find(_photo => _photo.idApi === photo.idApi)
        feedPhoto && (feedPhoto.liked = false)
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Likes()
