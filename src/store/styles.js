import { makeAutoObservable } from "mobx";

class Styles {
    colorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068", "#DC143C", "#ff56ff"]

    input = {
        size: "large",
        maxLength: 64,
        style: {
            borderRadius: 40,
            padding: "7px 15px",
        },
    }

    constructor() {
        makeAutoObservable(this)
    }
}

export default new Styles()