import axios from "axios";

export const firebase = axios.create({
    baseURL: process.env.REACT_APP_DB_URL,
})
