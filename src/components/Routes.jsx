import React, { useEffect } from "react"
import { Route, Switch, Redirect, useLocation } from "react-router-dom"
import { observer } from "mobx-react-lite";
import routes from "../global/routes"
import Feed from "./Feed/Feed";
import Profile from "./Profile/Profile";
import auth from "../store/auth";
import scrollTo from "../utils/scrollTo";

export default observer(() => {
    const { pathname, } = useLocation()

    useEffect(() => {
        if (pathname === routes.profile && !auth.isLoggedIn && !auth.isLoggedOut) {
            auth.openModal()
        }
    }, [auth.isLoggedIn, auth.isLoggedOut])

    useEffect(() => {
        scrollTo(0, 0)
    }, [pathname])

    return (
        <Switch>
            {
                auth.isLoggedIn ?
                    <Route exact path={routes.profile}>
                        <Profile/>
                    </Route>
                    :
                    <Redirect from={routes.profile} to={routes.home}/>
            }

            <Route exact path={routes.feed}>
                <Feed/>
            </Route>

            <Redirect from={"*"} to={routes.home}/>
        </Switch>
    )
})
