import firebase from "firebase/app";
import "firebase/database"
import "firebase/auth"
import "firebase/storage"

class Firebase {
    db(path) {
        return firebase.database().ref(path)
    }
    get auth() {
        return firebase.auth()
    }
    storage(img) {
        return firebase.storage().ref("images/" + img)
    }
    config = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        databaseURL: process.env.REACT_APP_DB_URL,
        storageBucket: "gs://react-gallery-app-fe070.appspot.com",
    }
    init() {
        firebase.initializeApp(this.config)
    }
}

export default new Firebase()