import React, { Component } from 'react'
import axios from 'axios'
axios.defaults.baseURL = 'http://134.175.224.127:7003';
class MyList extends Component {

    constructor() {
        super();
        this.state = {
            playlist: [],
        }
    }

    getUserPlayList() {
        return axios.get('/user/playlist?uid=111736605');
    }

    componentWillMount() {
        this.getUserPlayList().then(res => {
            this.setState({ playlist: res.data.playlist })
        })
    }

    render() {
        return (
            <div>
                mymusic
            </div>
        )
    }
}

export default MyList