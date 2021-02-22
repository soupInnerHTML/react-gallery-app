import axios from "axios";

export const db = axios.create({
    baseURL: process.env.REACT_APP_DB_URL,
})
