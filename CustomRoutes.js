import React from 'react';
import { Route, withRouter } from 'react-router-dom';



const CustomRoutes = ({
    component: C,
    cmpProps = {},
    routes,
    exact = false,
    path
}) => {
    return (
        <Route
            exact={exact}
            path={path}
            render={ (props) => (
                <C
                    {...props}
                    {...cmpProps}
                    routes={routes}
                />
            )}
        />
    );
};

export default withRouter(CustomRoutes);