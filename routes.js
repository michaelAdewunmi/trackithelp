import Home from '../containers/Home/Home';
import Login from '../containers/Login/Login';
import Signup from '../containers/Signup/Signup';
//import User from '../containers/User/User';
import User2 from '../containers/User2/User2';
import UserProfile from '../containers/UserProfile/UserProfile';



export default [
    {
        path: '/',
        exact: true,
        component: Home,
    },
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/signup',
        exact: true,
        component: Signup,
    },
    {
        path: '/user',
        component: User2,
        beAuthorized: true,
        routes: [
            {
                path: '/user/profile',
                component: UserProfile,
            }
        ],
    }
];