import { makeAutoObservable } from "mobx";

class Routes {
    feed = "/"
    home = "/"
    profile = "/profile"

    constructor() {
        makeAutoObservable(this)
    }

}

export default new Routes()