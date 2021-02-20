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
        // console.log(Object(auth.authState))
        if (pathname === routes.profile && !auth.isLoggedIn && !auth.isLoggedOut) {
            auth.openModal()
        }
    }, [JSON.stringify(auth.authState)])

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