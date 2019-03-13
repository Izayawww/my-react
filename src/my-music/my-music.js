import React, { Component } from 'react'
import { Button, Avatar, Table, Icon, Skeleton, Input, message, List } from 'antd';
import CommentListComp from '../components/CommentListComp'
import axios from 'axios'
import { connect } from 'react-redux'
import '../playlist/index.scss'
import './mymusic.scss'
axios.defaults.baseURL = 'http://134.175.224.127:7003';
const { TextArea } = Input

class MyMusic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userPlaylist: '',
            playlist: '',
            commentList: {},
            commentValue: '',
            columns: [
                { title: '序号', key: 'index', render: (text, record, index) => <div className='table-index'><span>{index + 1}</span><span><Icon type="play-circle" /></span></div>, width: 50 },
                { title: '歌曲标题', dataIndex: 'name', key: 'name' },
                { title: '时长', dataIndex: 'dt', key: 'dt', render: text => <span>{parseInt(text / 60000) + ':' + parseInt((parseFloat(text / 60000) - parseInt(text / 60000)) * 60)}</span> },
                { title: '歌手', dataIndex: 'ar', key: 'ar', render: text => <span>{text[0].name}</span> },
                { title: '专辑', dataIndex: 'al', key: 'al', render: text => <span className='list-item-name'>{text.name}</span> }]
        }
    }

    getUserList() {
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        return new Promise((resolve) => {
            axios.get('/user/playlist?uid=' + userInfo.profile.userId).then(res => {
                this.setState({ userPlaylist: res.data.playlist })
                this.props.dispatch({ type: 'userPlaylist', data: res.data.playlist })
                resolve(res.data.playlist[0].id)
            })
        })
    }

    getList(id) {
        axios.get('/playlist/detail?id=' + id).then(res => {
            this.setState({ playlist: res.data.playlist })
        })
    }

    getComment(id) {
        axios.get('/comment/playlist?id=' + id).then(res => {
            this.setState({ commentList: res.data })
        })
    }

    async componentDidMount() {
        let listId
        if (this.props.state.userPlaylist) {
            this.setState(this.props.state)
            listId = this.props.state.userPlaylist[0].id
        } else {
            listId = await this.getUserList()
        }
        await this.getList(listId)
        this.getComment(listId)
    }

    handleComment(e) {
        this.setState({ commentValue: e.currentTarget.value })
    }

    submitComment() {
        axios.get(`/comment?t=1&type=2&id=${this.props.match.params.id}&content=${this.state.commentValue}`).then(res => {
            if (res.data.code === 200) {
                message.success("评论成功~")
                this.setState({ commentValue: '' })
            } else {
                message.error("评论失败.")
            }
        })
    }

    handleLike(type, info) {
        let subInfo = info.split('-')
        axios.get(`/comment/like?id=${this.props.match.params.id}&cid=${subInfo[0]}&t=${subInfo[1] === '1' ? 0 : 1}&type=2`).then(res => {
            if (res.data.code === 200) {
                let temp = this.state.commentList
                let liked = subInfo[1] === '1' ? 0 : 1
                if (type === 'hot') {
                    temp.hotComments[subInfo[2]].liked = liked
                    liked ? ++temp.hotComments[subInfo[2]].likedCount : --temp.hotComments[subInfo[2]].likedCount
                } else {
                    temp.comments[subInfo[2]].liked = liked
                    liked ? ++temp.comments[subInfo[2]].likedCount : --temp.comments[subInfo[2]].likedCount
                }
                this.setState({ commentList: temp })
            }
        })
    }

    changeList(e) {
        e.preventDefault();
        this.getList(e.target.dataset.id)
        this.getComment(e.target.dataset.id)
    }

    render() {
        const { userPlaylist, playlist, columns, commentList } = this.state
        const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const size = 'small'
        return playlist ? (
            <div className='list-page'>
                <div className='list-left'>
                    <List
                        itemLayout="horizontal"
                        dataSource={userPlaylist}
                        size="small"
                        onClick={this.changeList.bind(this)}
                        renderItem={item => (
                            <List.Item >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.coverImgUrl} shape="square" />}
                                    title={<span className='userlist-item' data-id={item.id}>{item.name}</span>}
                                    description={item.trackCount + '首'}
                                />
                            </List.Item>
                        )}
                    />
                </div>
                <div className='list-main list-my-main'>
                    <div style={{ position: 'relative' }}>
                        <div className='bg-img' style={{ backgroundImage: `url(${playlist.coverImgUrl})` }}></div>
                        <div className='list-main-info'>
                            <div><Avatar src={playlist.coverImgUrl} size={160} shape="square" /></div>
                            <div className='list-info'>
                                <div>
                                    <span className='list-type'>歌单</span>
                                    <span className='list-name'>{playlist.name}</span>
                                </div>
                                <div>
                                    <div className='list-creater-info'>
                                        <Avatar src={userInfo.profile.avatarUrl} />
                                        <div className='creater-name'>{userInfo.profile.nickname}</div>
                                        <span>{new Date(playlist.createTime).toLocaleDateString()}创建</span>
                                    </div>
                                </div>
                                <div className='list-btns'>
                                    <Button shape="round" ghost icon="folder-add" size={size}>收藏</Button>
                                    <Button shape="round" ghost icon="share-alt" size={size}>分享</Button>
                                    <Button shape="round" ghost icon="download" size={size}>下载</Button>
                                    <Button shape="round" ghost icon="message" size={size}>{playlist.commentCount}</Button>
                                </div>
                                <div>
                                    <span>标签：</span>
                                    {playlist.tags.map(item =>
                                        <span className='tages' key={item}>{item}</span>
                                    )}
                                </div>
                                <div>
                                    <span>介绍：</span>
                                    <span>{playlist.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='list-table-title'>
                            <span className='list-title'>歌曲列表</span>
                            <span className='list-len'>{playlist.tracks.length}首歌</span>
                            <span className='list-playcount'>播放：<span className='list-count'>{playlist.playCount}</span>次</span>
                        </div>
                        <Table columns={columns} dataSource={playlist.tracks}
                            rowKey={item => item.id}
                            size="small"
                            pagination={{
                                pageSize: 20,
                                size: 'small',
                            }}
                            loading={this.state.loading}
                            onRow={() => {
                                return {
                                    onDoubleClick: (event) => {
                                        this.props.history.push('/song/' + event.currentTarget.dataset.rowKey)
                                    },
                                }
                            }}
                        ></Table>
                        <div className='list-table-title'>
                            <span className='list-title'>评论</span>
                            <span className='list-len'>共{playlist.commentCount}条评论</span>
                        </div>

                        <div>
                            <div className='comment-div'>
                                <Avatar shape="square" size={54} src={userInfo.profile.avatarUrl} />
                                <TextArea placeholder="评论" autosize={{ minRows: 2, maxRows: 2 }} onChange={this.handleComment.bind(this)} />
                            </div>
                            <div className='comment-btn'><Button shape="round" size={size} onClick={this.submitComment.bind(this)}>评论</Button></div>
                        </div>

                        <div className='list-comment-title'>
                            精彩评论
                        </div>
                        <CommentListComp lists={commentList.hotComments} onLikeChange={this.handleLike.bind(this, 'hot')}></CommentListComp>

                        <div className='list-comment-title'>
                            最新评论({commentList.comments && commentList.comments.length})
                        </div>
                        <CommentListComp lists={commentList.comments} onLikeChange={this.handleLike.bind(this, 'nor')}></CommentListComp>
                    </div>
                </div>
            </div>
        ) : <Skeleton active paragraph={{ rows: 6, width: [480, 680, 820, 650, 700, 730] }} title={false} />
    }
}

const mapStateToProps = (state) => {
    return {
        state: {
            userInfo: state.userInfo,
            userPlaylist: state.userPlaylist
        }
    }
};
export default connect(mapStateToProps)(MyMusic)