import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import routes from '../routes/routes';
import Navigation from '../components/Header/Navigation';
import CustomRoutes from './CustomRoutes/CustomRoutes';

export default class App extends Component {


    clickFunc = (e) => {
        e.currentTarget.classList.toggle('close');
        document.getElementsByTagName('nav')[0].classList.toggle('revealed');
    }
    render() {
        return (
            <div id="the-container">
                <Navigation clickFunc={this.clickFunc} />
                <section id="routes-wrapper">
                    <Switch>
                        {
                            routes.map((route) => (
                                <CustomRoutes
                                    beAuthorized={route.beAuthorized}
                                    component={route.component}
                                    exact={route.exact}
                                    key={route.key || route.path}
                                    path={route.path}
                                    routes={route.routes}
                                />
                            ))
                        }
                    </Switch>
                </section>

            </div>
        );
    }
}