import React, { Component } from 'react'
import { Icon, Table, Avatar } from 'antd';
import axios from 'axios'
import './index.scss'
import { connect } from 'react-redux'
import { italic } from 'ansi-colors';
axios.defaults.baseURL = 'http://134.175.224.127:7003';
const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
class Myhomepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userPlaylist: [],
            history: [],
            userInfo: '',
            showAll: false,
            columns: [
                { title: '序号', key: 'index', render: (text, record, index) => <div className='table-index'><span>{index + 1}</span><span><Icon type="play-circle" /></span></div>, width: 50 },
                { title: '歌曲', dataIndex: 'name', key: 'name', render: text => <span className='list-item-name'>{text.name}<span className='list-item-arname'> - {text.arname}</span></span> },
                { title: '次数', dataIndex: 'playCount', key: 'playCount', render: text => <span className='list-item-name'>{text}次</span> }
            ]
        }
    }


    componentDidMount() {
        this.getPlayList()
        this.getUserList();
    }

    getUserList() {
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        if (this.props.userPlaylist) {
            this.setState({ userPlaylist: this.props.userPlaylist })
            return;
        }
        axios.get('/user/playlist?uid=' + userInfo.profile.userId).then(res => {
            this.setState({ userPlaylist: res.data.playlist })
            this.props.dispatch({ type: 'userPlaylist', data: res.data.playlist })
        })
    }

    getPlayList(type = 1, slice = 10) {
        axios.get(`/user/record?uid=${userInfo.profile.userId}&type=${type}`).then(res => {
            let htype = type === 1 ? 'weekData' : 'allData'
            let history = res.data[htype].slice(0, slice).map(item => {
                return { playCount: item.playCount, name: { name: item.song.name, arname: item.song.ar[0].name }, id: item.song.id }
            })
            this.setState({ history })
        })
    }

    showAll() {
        this.getPlayList(1, 100);
        this.setState({ showAll: true })
    }

    toPlaylist(e) {
        if (e.target.dataset.id) {
            this.props.history.push('/playlist/' + e.target.dataset.id)
        }
    }

    render() {
        const { showAll, userPlaylist, columns, history } = this.state
        return (
            <div className='content-main'>
                {!showAll && <div className='user-info'>
                    <Avatar src={userInfo.profile.avatarUrl} size={184} shape="square" />
                    <div className='user-maininfo'>
                        <div className='user-nlg'>
                            <span className='user-nickname'>{userInfo.profile.nickname}</span>
                            <span className='user-level'>{userInfo.level}</span>
                            <span className='user-gender'>{userInfo.profile.gender}</span>
                        </div>
                        <div className='user-active'>
                            <div>
                                <span>{userInfo.profile.eventCount}</span>
                                <div>动态</div>
                            </div>
                            <div className='user-follow'>
                                <span>{userInfo.profile.follows}</span>
                                <div>关注</div>
                            </div>
                            <div>
                                <span>{userInfo.profile.followeds}</span>
                                <div>粉丝</div>
                            </div>
                        </div>
                        <div>
                            <span>个人介绍：</span>
                            <span>{userInfo.profile.signature}</span>
                        </div>
                        <div>
                            <span>所在地区：</span>
                            <span>{userInfo.profile.city + '-' + userInfo.profile.province}</span>
                            <span>年龄：</span>
                            <span>{new Date(userInfo.profile.birthday).getFullYear().toString().slice(-2)}后</span>
                        </div>
                    </div>
                </div>
                }

                <div className='list-table-title'>
                    <span className='list-title'>听歌排行</span>
                    <span className='list-len'>累计听歌{userInfo.listenSongs}首歌</span>
                    <span className='list-playcount'>
                        <span onClick={this.getPlayList.bind(this, 1)}>最近一周</span>
                        <span> | </span>
                        <span onClick={this.getPlayList.bind(this, 0)}>所有时间</span>
                    </span>
                </div>
                <Table columns={columns} dataSource={history}
                    rowKey={item => item.id}
                    size="small"
                    showHeader={false}
                    loading={this.state.loading}
                    pagination={false}
                    onRow={() => {
                        return {
                            onDoubleClick: (event) => {
                                this.props.history.push('/song/' + event.currentTarget.dataset.rowKey)
                            },
                        }
                    }}
                ></Table>
                {!showAll && <div onClick={this.showAll.bind(this)} style={{textAlign:'right',fontStyle:'italic',cursor:'pointer'}}>
                    查看更多>
                </div>
                }
                {!showAll && <div>
                    <div className='list-table-title'>
                        <span className='list-title'>我创建的歌单({userPlaylist.length})</span>
                    </div>
                    <div className='content-list' onClick={this.toPlaylist.bind(this)}>
                        {
                            userPlaylist.map(item =>
                                <div className='content-info' key={item.id}>
                                    <div className='list-div' style={{ backgroundImage: `url(${item.coverImgUrl})` }} data-id={item.id}>
                                        <div className='list-play'>
                                            <div>
                                                <Icon type="customer-service" />
                                                <span className='play-count'>{item.playCount > 10000 ? parseInt(item.playCount / 10000) + '万' : item.playCount}</span>
                                            </div>
                                            <Icon type="play-circle" className='play-icon' />
                                        </div>
                                    </div>
                                    <div className='content-name'>
                                        <span>{item.name}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>}

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        userPlaylist: state.userPlaylist
    }
};
export default connect(mapStateToProps)(Myhomepage)