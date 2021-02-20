import { action, makeObservable, observable, runInAction } from "mobx";
import { firebase } from "../api/firebase";
import auth from "./auth";
import feed from "./feed";

class Likes {

    @observable _likes = []

    get = () =>  {
        return this._likes
    }

    @action.bound async set() {
        const { data, } = await firebase.get(`likes/${auth.authState.id}.json`)
        this._likes = Object.entries(data || {}).map(
            entry => ({
                ...entry[1],
                liked: true,
                name: entry[0],
            })
        ).reverse()
    }

    @action.bound async saveLike(photo) {
        runInAction(() => photo.liked = true)
        const { url, bigV, id, idApi, } = photo

        const { data, } = await firebase.post(`likes/${auth.authState.id}.json`, {
            url,
            bigV,
            id,
            idApi,
        })
        await this.set()
        const { name, } = data
        runInAction(() => {
            feed.photos = feed.photos.map(_photo => _photo.id === id ? { ..._photo, name, } : _photo)
        })
    }

    @action.bound async deleteLike(photo) {
        runInAction(() => {
            photo.liked = false
            //remove like from feed | cache
            let feedPhoto = (feed.photos.length ? feed.photos : feed.cachedPhotos).find(_photo => _photo.id === photo.id)
            feedPhoto.liked = false
        })
        await firebase.delete(`likes/${auth.authState.id}/${photo.name}.json`)
        this.set()
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Likes()