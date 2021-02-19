import { runInAction } from "mobx";
import React, { useEffect } from "react"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"
import { observer } from "mobx-react-lite";
import feed from "../store/feed";
import routes from "../store/routes"
import Feed from "./Feed/Feed";
import Profile from "./Profile/Profile";
import auth from "../store/auth";

export default observer(() => {
    const { pathname, } = useLocation()

    useEffect(() => {
        console.log(auth.authState)
        if (pathname === routes.profile && auth.authState === null && !auth.isLoggedOut) {
            auth.openModal()
        }
        if (auth.isLoggedOut) {
            // runInAction(() => feed.photos = feed.photos.map(photo => ({ ...photo, liked: false, }) ))
            runInAction(() => feed.photos = [] )
            feed.addPhotos()
        }
    }, [JSON.stringify(auth.authState)])

    return (
        <Switch>
            {auth.authState === null ? <Redirect from={routes.profile} to={routes.home}/> : <Route exact path={routes.profile} component={Profile} />}
            <Route exact path={routes.feed} component={Feed} />
        </Switch>
    )
})