import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isEmail, trim, isEmpty }  from 'validator';


import withStyles from 'isomorphic-style-loader/withStyles';
import TextInput from '../../components/textInput/TextInput';
import Button from '../../components/button/Button';
import sharedStyles from '../sharedStyles/sharedstyles.css';

import { setUserEmail, setUserPassword, userAuthenticated, setLoginError, setUserInfo  } from './actions/actions';


const mapStateToProps = state => {
    return {
        email: state.loginInfoChange.emailFieldVal,
        password: state.loginInfoChange.passwordFieldVal,
        authenticated: state.loginInfoChange.authenticated,
        loginError: state.loginInfoChange.loginError,
        userInfo: state.loginInfoChange.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        onEmailChange: event => dispatch(setUserEmail(event.target.value)),
        onPasswordChange: event => dispatch(setUserPassword(event.target.value)),
        onAuthenticated: val => dispatch(userAuthenticated(val)),
        onLoginError: error => dispatch(setLoginError(error)),
        onUserInfoObtained: user => dispatch(setUserInfo(user))
    }
}

class Login extends Component {

    showRule = (e) => {
        e.currentTarget.parentElement.classList.add('active');
        this.props.onLoginError(null)
    }

    hideRule = (e) => {
        if(e.target.value==='') {
            e.currentTarget.parentElement.classList.remove('active');
        }
    }

    submitAndLogin = (e) => {
        e.preventDefault();
        const { email, password, onLoginError } = this.props;

        if ( isEmpty(trim(password)) && isEmpty(trim(email)))
        {
            onLoginError('Please Fill in the Fields before attempting to sign in');
            return;
        }

        if(!isEmpty(email) && !isEmail(email)) {
            onLoginError('Please input a valid Email Address');
            return;
        }

        const loginInfo = {
            email,
            password
        }

        fetch(`${process.env.REACT_APP_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data);
            if (
                data.auth && data.message==='User Found, Authenticated and Logged In'
            ) {
                const { onAuthenticated, onUserInfoObtained } = this.props;
                //window.localStorage.setItem('JWT', data.token);
                onUserInfoObtained(data.user[0]);
                // this.props.history.push({
                //     pathname: '/user',
                //     state: {
                //         user: data.user[0],
                //         allow: true,
                //     },
                // })
                onAuthenticated(true);
               // window.location.href = '/user';
                //console.log(data);
            }else{
                this.props.onLoginError(data.error);
            }
        }).catch(err=> err ? console.log("There's a problem") : '');
    }
    render() {
        const { authenticated, loginError, onPasswordChange, onEmailChange, userInfo } = this.props;
        if(authenticated) {
            return (
                <Redirect
                    to={{
                        pathname: '/user',
                        state: {
                            user: userInfo,
                            allow: true,
                        },
                    }}

                />
            )
        }
        return (
            <section id='section-container'>
                <div className="form-wrapper">
                    <legend>Login</legend>
                    <hr className='top-rule'/>
                    <div className="inputs-wrapper">
                        <div className={`error-div ${ loginError !== null ? 'show' : 'hide'}`}>
                            { loginError !== null ? <p className="login-err">{loginError}</p> : ''}
                        </div>
                        <TextInput
                            focusInFunc={this.showRule}
                            focusOutFunc={this.hideRule}
                            id="email" labelName="Email"
                            onChangeFunc={onEmailChange} type="email"
                        />
                        <TextInput
                            focusInFunc={this.showRule}
                            focusOutFunc={this.hideRule}
                            id="password" labelName="Password"
                            onChangeFunc={onPasswordChange} type="password"
                        />
                        <Button
                            clickFunc={this.submitAndLogin} text="Login"
                        />
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(sharedStyles)(Login));