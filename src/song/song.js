import React, { Component } from 'react'
import { Button, Avatar, Input, message } from 'antd';
import axios from 'axios'
import '../playlist/index.scss'
import './song.scss'
import CommentListComp from '../components/CommentListComp'
const {TextArea} = Input
axios.defaults.baseURL = 'http://134.175.224.127:7003';
axios.defaults.withCredentials=true
class PlaylistComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            songDetail: '',
            lyric: [],
            simiUserList: [],
            commentList: {},
            relateList: [],
            loading: false,
            songUrl:'',
        }
    }

    getSongDetail() {
        axios.get('/song/detail?ids=' + this.props.match.params.id).then(res => {
            this.setState({ songDetail: res.data.songs[0] })
        })
    }
    
    getSongUrl() {
        axios.get('/song/url?id=' + this.props.match.params.id).then(res => {
            this.setState({ songUrl: res.data.data[0].url})
        })
    }

    getIyric() {
        axios.get('/lyric?id=' + this.props.match.params.id).then(res => {
            let temp, ps = res.data.lrc.lyric
            let psAry = ps.split('\n')
            let lyric = psAry.map(item => {
                item = item.split(']')
                if (item[1]) {
                    temp = item[0].match(/\d{2}/g)
                    item[0] = temp[0] * 60 + Number(temp[1])
                }
                return item;
            })
            this.setState({ lyric })
        })
    }

    getComment() {
        axios.get('/comment/music?id=' + this.props.match.params.id).then(res => {
            this.setState({ commentList: res.data })
        })
    }

    getRelateList() {
        axios.get('/simi/song?id=' + this.props.match.params.id).then(res => {
            let relateList = res.data.songs.map(item => {
                return { arname: item.artists[0].name, name: item.name, id: item.id }
            })
            this.setState({ relateList })
        })
    }

    getSimiUserList() {
        axios.get(`/simi/user?id=${this.props.match.params.id}`).then(res => {
            let simiUserList = res.data.userprofiles.map(item => {
                return { nickname: item.nickname, avatarUrl: item.avatarUrl, userId: item.userId, recommendReason: item.recommendReason }
            })
            this.setState({ simiUserList })
        })
    }

    async componentDidMount() {
        await this.getSongDetail()
        await this.getIyric()
        this.getSongUrl()
        this.getRelateList()
        this.getSimiUserList()
        this.getComment()
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
    handleLike(type,info){
        let subInfo = info.split('-')
        axios.get(`/comment/like?id=${this.props.match.params.id}&cid=${subInfo[0]}&t=${subInfo[1]==='1'?0:1}&type=2`).then(res=>{
            if(res.data.code===200){
                let temp = this.state.commentList
                let liked = subInfo[1]==='1'?0:1
                if(type==='hot'){
                    temp.hotComments[subInfo[2]].liked=liked
                    liked?++temp.hotComments[subInfo[2]].likedCount:--temp.hotComments[subInfo[2]].likedCount
                }else{
                    temp.comments[subInfo[2]].liked=liked
                    liked?++temp.comments[subInfo[2]].likedCount:--temp.comments[subInfo[2]].likedCount
                }
                this.setState({commentList:temp})
            }
        })
    }
    render() {
        const { songDetail, lyric, commentList, simiUserList, relateList,songUrl } = this.state
        const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const size = 'small'
        return songDetail && (
            <div className='list-page'>
                <audio src={songUrl} autoPlay />
                <div className='list-main'>
                    <div style={{ position: 'relative' }}>
                        <div className='bg-img' style={{ backgroundImage: `url(${songDetail.al.picUrl})` }}></div>
                        <div className='list-main-info'>
                            <div><Avatar src={songDetail.al.picUrl} size={160} shape="square" /></div>
                            <div className='list-info'>
                                <div>
                                    <span className='list-type'>歌曲</span>
                                    <span className='list-name'>{songDetail.name}</span>
                                </div>
                                <div>
                                    <span>歌手：</span>
                                    <span>{songDetail && songDetail.ar[0].name}</span>
                                </div>
                                <div>
                                    <span>所属专辑：</span>
                                    <span>{songDetail && songDetail.al.name}</span>
                                </div>
                                <div className='list-btns'>
                                    <Button shape="round" ghost icon="folder-add" size={size}>收藏</Button>
                                    <Button shape="round" ghost icon="share-alt" size={size}>分析</Button>
                                    <Button shape="round" ghost icon="download" size={size}>下载</Button>
                                    <Button shape="round" ghost icon="message" size={size}>{commentList.total}</Button>
                                </div>
                                <div className='lyric-main'>
                                    <div className='lyric-inner'>
                                        {lyric.map((item,index) => <p key={index}>{item[1]}</p>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='list-table-title'>
                            <span className='list-title'>评论</span>
                            <span className='list-len'>共{commentList && commentList.total}条评论</span>
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
                        <CommentListComp lists={commentList.hotComments} onLikeChange={this.handleLike.bind(this,'hot')}></CommentListComp>

                        <div className='list-comment-title'>
                            最新评论({commentList.comments && commentList.comments.length})
                        </div>
                        <CommentListComp lists={commentList.comments} onLikeChange={this.handleLike.bind(this,'nor')}></CommentListComp>
                    </div>
                </div>
                <div className='list-right'>
                    <div className='list-relate-title'>
                        最近听过
                </div>
                    {simiUserList.map(item =>
                        <div className='list-relate' key={item.userId}>
                            <div className='list-relate-img'><Avatar shape="square" size={42} src={item.avatarUrl} /></div>
                            <div>
                                <div className='list-relate-name'>{item.nickname}</div>
                                <span className='list-creatot-nickname'>{item.recommendReason}</span>
                            </div>
                        </div>
                    )}
                    <div className='list-relate-title'>
                        相似歌曲
                    </div>
                    {relateList.map(item =>
                        <div className='list-relate' key={item.id}>
                            <div>
                                <div className='list-relate-name'>{item.name}</div>
                                <span className='list-creatot-nickname'>{item.arname}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default PlaylistComp