import { action, makeObservable, observable, runInAction } from "mobx";
import feed from "./feed";
import user from "./user";
import _firebase from "../global/firebase";

class Likes {

    @observable _likes = []
    @observable isLoaded = false

    get = () =>  {
        return this._likes
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
    }

    @action.bound async saveLike(photo) {
        runInAction(() => photo.liked = true)
        const { url, bigV, id, idApi, } = photo


        await _firebase.db(`likes/${user.current.uid}/${id}`).set({
            url,
            bigV,
            idApi,
        })

    }

    @action.bound async deleteLike(photo) {
        runInAction(() => {
            photo.liked = false
            //remove like from feed | cache
            let feedPhoto = (feed.photos.length ? feed.photos : feed.cachedPhotos).find(_photo => _photo.idApi === photo.idApi)
            feedPhoto && (feedPhoto.liked = false)
        })
        await _firebase.db(`likes/${user.current.uid}/${photo.id}`).remove()
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Likes()