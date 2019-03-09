import React, { Component } from 'react'
import { Button, Avatar, Table, Icon, List } from 'antd';
import axios from 'axios'
import { Link, Router } from 'react-router-dom';
import './index.scss'
axios.defaults.baseURL = 'http://134.175.224.127:7003';

const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);

const CommentListComp = ({ lists }) => (
    <List
        itemLayout="vertical"
        size="small"
        dataSource={lists}
        pagination={{
            pageSize: 10,
            size: 'small',
        }}
        renderItem={item => (
            <List.Item
                key={item.time}
                actions={[<span style={{ marginLeft: 80 }}>{new Date(item.time).toLocaleDateString()}</span>, <IconText type="like-o" text={item.likedCount} />]}
            >
                <List.Item.Meta
                    avatar={<Avatar shape="square" size={64} src={item.user.avatarUrl} />}
                    title={<span className='comment-nickname'>{item.user.nickname}</span>}
                    description={<span className='comment-nickname'>{item.content}</span>}
                />
            </List.Item>
        )}
    />
)
class PlaylistComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlist: '',
            commentList: {},
            relateList: [],
            loading: false,
            columns: [
                { title: '序号', dataIndex: 'id', key: 'index', render: (text, record, index) => <div className='table-index'><span>{index + 1}</span><span to={'/song/' + text}><Icon type="play-circle" data-id={text} /></span></div>, width: 50 },
                { title: '歌曲标题', dataIndex: 'name', key: 'name' },
                { title: '时长', dataIndex: 'dt', key: 'dt', render: text => <span>{parseInt(text / 60000) + ':' + parseInt((parseFloat(text / 60000) - parseInt(text / 60000)) * 60)}</span> },
                { title: '歌手', dataIndex: 'ar', key: 'ar', render: text => <span>{text[0].name}</span> },
                { title: '专辑', dataIndex: 'al', key: 'al', render: text => <span className='list-item-name'>{text.name}</span> }]
        }
    }

    getUserPlayList() {
        this.setState({ loading: true })
        axios.get('/playlist/detail?id=' + this.props.match.params.id).then(res => {
            this.setState({ playlist: res.data.playlist, loading: false })
        })
    }

    getComment() {
        axios.get('/comment/playlist?id=' + this.props.match.params.id).then(res => {
            this.setState({ commentList: res.data })
        })
    }

    getRelateList() {
        axios.get('/related/playlist?id=' + this.props.match.params.id).then(res => {
            this.setState({ relateList: res.data.playlists })
        })
    }

    async componentDidMount() {
        await this.getUserPlayList()
        this.getRelateList();
        this.getComment()
    }

    render() {
        const { playlist, columns, commentList, relateList } = this.state
        const { creator } = playlist
        const size = 'small'
        return playlist && (
            <div className='list-page'>
                <div className='list-main'>
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
                                    <span>标签：</span>
                                    {playlist.tags.map(item =>
                                        <span className='tages' key={item}>{item}</span>
                                    )}
                                </div>
                                <div className='list-btns'>
                                    <Button shape="round" ghost icon="folder-add" size={size}>{playlist.subscribedCount}</Button>
                                    <Button shape="round" ghost icon="share-alt" size={size}>{playlist.shareCount}</Button>
                                    <Button shape="round" ghost icon="download" size={size}>下载</Button>
                                    <Button shape="round" ghost icon="message" size={size}>{playlist.commentCount}</Button>
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
                                        this.props.history.push('/song/' + event.target.dataset.rowKey)
                                    },
                                }
                            }}
                        ></Table>
                        <div className='list-table-title'>
                            <span className='list-title'>评论</span>
                            <span className='list-len'>共{playlist.commentCount}条评论</span>
                        </div>

                        <div className='list-comment-title'>
                            精彩评论
                        </div>
                        <CommentListComp lists={commentList.hotComments}></CommentListComp>

                        <div className='list-comment-title'>
                            最新评论({commentList.comments && commentList.comments.length})
                        </div>
                        <CommentListComp lists={commentList.comments}></CommentListComp>
                    </div>
                </div>
                <div className='list-right'>
                    <div className='list-relate-title'>
                        创建人
                    </div>
                    <div className='list-creater'>
                        <div className='user-avatar'><Avatar shape="square" size={52} src={creator.avatarUrl} /></div>
                        <div className='list-creater-info'>
                            <div className='creater-name'>{creator.nickname}</div>
                            <div className='creater-signature'>{creator.signature}</div>
                            <span>{new Date(playlist.createTime).toLocaleDateString()}创建</span>
                        </div>
                    </div>

                    <div className='list-relate-title'>
                        相关推荐
                    </div>
                    {relateList.map(item =>
                        <div className='list-relate' key={item.id}>
                            <div className='list-relate-img'><Avatar shape="square" size={42} src={item.coverImgUrl} /></div>
                            <div>
                                <div className='list-relate-name'>{item.name}</div>
                                <span className='list-creatot-nickname'>by {item.creator.nickname}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default PlaylistComp