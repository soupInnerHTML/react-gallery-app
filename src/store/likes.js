import { action, makeObservable, observable, runInAction } from "mobx";
import { db } from "../api/firebase";
import feed from "./feed";
import user from "./user";

class Likes {

    @observable _likes = []

    get = () =>  {
        return this._likes
    }

    @action.bound async set(customId) {
        const { data, } = await db.get(`likes/${customId || user.current.uid}.json`)
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

        const { data, } = await db.post(`likes/${user.current.uid}.json`, {
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
            let feedPhoto = (feed.photos.length ? feed.photos : feed.cachedPhotos).find(_photo => _photo.idApi === photo.idApi)
            feedPhoto && (feedPhoto.liked = false)
        })
        await db.delete(`likes/${user.current.uid}/${photo.name}.json`)
        await this.set()
    }

    constructor() {
        makeObservable(this)
    }

}

export default new Likes()