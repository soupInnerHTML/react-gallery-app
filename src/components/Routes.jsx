import React, { useEffect } from "react"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"
import { observer } from "mobx-react-lite";
import routes from "../store/routes"
import Feed from "./Feed";
import Profile from "./Profile/Profile";
import auth from "../store/auth";

export default observer(() => {
    const { pathname, } = useLocation()

    useEffect(() => {
        // console.log(auth.authState)
        if (pathname === routes.profile && auth.authState === null && !auth.isLoggedOut) {
            auth.openModal()
        }
    }, [JSON.stringify(auth.authState)])

    return (
        <Switch>
            {auth.authState === null ? <Redirect from={routes.profile} to={routes.home}/> : <Route exact path={routes.profile} component={Profile} />}
            <Route exact path={routes.feed} component={Feed} />
        </Switch>
    )
})