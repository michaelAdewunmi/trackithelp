import React, { Component } from 'react';

export default class User2 extends Component {

    constructor(props) {
        super(props);
        let user;

        if(__isBrowser__) {
            user = window.__INITIAL_DATA__ ? window.__INITIAL_DATA__ :  props.location.state.user;
            //!window.__INITIAL_DATA__ ? window.location.reload(true) : '';
            // console.log('props', props.location.state.user);
            console.log('window', window.__INITIAL_DATA__);
            delete window.__INITIAL_DATA__;
        } else {
            user = props.staticContext.user !== null && props.staticContext.user !== undefined ? props.staticContext.user[0] : null;
            console.log("theuser", user);
        }

        this.state = {
            user
        }
    }

    componentDidMount = () => {
        //if(this.props.location===null || this.props.location.state===undefined) this.props.history.push('/login');
    }


    render() {
        const { user } = this.state
        return (
            <div id="user" style={{paddingTop: '90px'}}>
                {`welcome ${user !== null && user !== undefined ? this.state.user.email : ''}`}
            </div>
        )
    }
}