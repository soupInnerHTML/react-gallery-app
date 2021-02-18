import { action, computed, makeObservable, observable } from "mobx";
import { uniqueId } from "lodash";
import getRandInt from "../utils/getRandInt";
import auth from "./auth";

class Feed {
    @observable photos = []
    @observable IMG_WIDTH = 500
    @observable IMG_HEIGHT = 500
    @observable R_SHIFT = 100
    @observable M_SHIFT = 300

    @computed get imgWidth() {
        return getRandInt(this.IMG_WIDTH + this.R_SHIFT, this.IMG_WIDTH - this.R_SHIFT)
    }
    @computed get imgHeight() {
        return getRandInt(this.IMG_HEIGHT + this.R_SHIFT, this.IMG_HEIGHT - this.R_SHIFT)
    }

    @action.bound addPhotos(newPhotos = this.generateRandomPhotos()) {
        this.photos.push(...newPhotos)
    }
    @action.bound lazyLoad() {
        const windowHeight = window.innerHeight
        const documentHeight = document.body.scrollHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (windowHeight + scrollTop >= documentHeight - documentHeight / 4) {
            this.addPhotos()
            console.log("fecthed photos on lazy load")
        }
    }
    @action.bound likePhoto(id, flag = true) {
        this.photos = this.photos.map(photo => photo.id === id ? { ...photo, liked: flag, } : photo)


    }

    //secondary functions
    generateRandomPhotos() {
        const { imgWidth, imgHeight, } = this
        return Array.from({ length: 12, }, x => {
            const { blackList, } = auth.authState || { blackList: {}, }
            const _id = getRandInt(500)

            if (Object.values(blackList).some(x => x === _id)) {
                return {
                    url: "1",
                    id: +new Date + uniqueId(),  //timestamp +
                }
            }

            const base = "https://picsum.photos/id/" + _id
            const _w = imgWidth
            const _h = imgHeight
            const _url = `${base}/${_w}/${_h}`

            return {
                url: _url,
                idApi: _id,
                bigV: `${base}/${_h + this.M_SHIFT}/${_h + this.M_SHIFT}`,
                liked: !!(auth.authState?.liked || []).map(like => like.url).find(url => url === _url),
                id: +new Date + uniqueId(),  //timestamp +
            }
        })
    }

    constructor() {
        makeObservable(this)
    }
}

export default new Feed()