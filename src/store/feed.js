import { action, computed, makeObservable, observable } from "mobx";
import sample from "lodash/sample"
import uniqBy from "lodash/uniqBy"
import uniqueId from "lodash/uniqueId"
import getRandInt from "../utils/getRandInt";
import likes from "./likes";
import { Modal } from "antd";

class Feed {
    @observable photos = []
    @observable cachedPhotos = []
    @observable portion = 0
    @observable ids = []
    @observable IMG_WIDTH = 500
    @observable IMG_HEIGHT = 500
    @observable R_SHIFT = 100
    @observable M_SHIFT = 300
    @observable isLikesOnly = false
    @observable isFullScreenMode = false

    @computed get imgWidth() {
        return getRandInt(this.IMG_WIDTH + this.R_SHIFT, this.IMG_WIDTH - this.R_SHIFT)
    }
    @computed get imgHeight() {
        return getRandInt(this.IMG_HEIGHT + this.R_SHIFT, this.IMG_HEIGHT - this.R_SHIFT)
    }

    @action.bound addPhotos(newPhotos = this.generateRandomPhotos()) {
        this.photos = uniqBy([...this.photos, ...newPhotos], "idApi")
    }
    @action.bound lazyLoad() {
        const windowHeight = window.innerHeight
        const documentHeight = document.body.scrollHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (windowHeight + scrollTop >= documentHeight - documentHeight / 4) {
            this.addPhotos()
            console.log("fetched photos on lazy load")
        }
    }

    @action.bound async getList(from = 1, to = 10) {
        try {
            for (from; from <= to; from++) {
                const response = await fetch(`https://picsum.photos/v2/list?page=${from}&limit=100`)
                const data = await response.json()
                this.ids.push(...data.map(photo => photo.id))
            }
        }
        catch (e) {
            Modal.error({ title: "Failed to fetch content", content: "Please try to use VPN!", })
        }
    }

    @action.bound generateRandomPhotos() {

        if (this.cachedPhotos.length) {
            let temp = this.portion
            this.portion += 12
            const photos = this.cachedPhotos.slice(temp, this.portion)

            if (photos.length) {
                return photos
            }
        }

        return Array.from({ length: 12, }, x => {
            let idApi

            if (this.ids.length) {
                idApi = sample(this.ids)
            }
            else {
                idApi = getRandInt(500)
            }

            const base = "https://picsum.photos/id/" + idApi
            const _w = this.imgWidth
            const _h = this.imgHeight
            const url = `${base}/${_w}/${_h}`
            const timestamp = +new Date


            return {
                url,
                timestamp,
                idApi,
                liked: !!likes.get().find(like => like.idApi === idApi),
                fromFeed: true,
                width: getRandInt(this.IMG_WIDTH + this.R_SHIFT, this.IMG_WIDTH - this.R_SHIFT),
                height: getRandInt(this.IMG_HEIGHT + this.R_SHIFT, this.IMG_HEIGHT - this.R_SHIFT),
                bigV: `${base}/${_h + this.M_SHIFT}/${_h + this.M_SHIFT}`,
                id: timestamp + uniqueId(),
            }
        })
    }

    @action.bound syncLikes() {
        ["photos", "cachedPhotos"].forEach((entity) => {
            if (this[entity]?.length) {
                this[entity] = this[entity].map(photo => ({
                    ...photo,
                    liked: !!likes.get().find(x => x.idApi === photo.idApi),
                }))
            }
        })
    }

    constructor() {
        makeObservable(this)
    }
}

export default new Feed()
