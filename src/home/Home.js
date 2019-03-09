import React, { Component } from 'react'
import { Carousel, Icon, Avatar } from 'antd';
import axios from 'axios'
import './home.scss'
axios.defaults.baseURL = 'http://134.175.224.127:7003';
class Home extends Component {

    constructor(props) {
        super(props);
        this.carousel = null;
        this.state = {
            banners: [],
            recomendList: [],
            userInfo: {}
        }
    }

    getBanner() {
        return axios.get('/banner');
    }

    getRecomendList() {
        return axios.get('/personalized');
    }

    componentWillMount() {
        // axios.call([this.getBanner(), this.getRecomendList()]).then(axios.spread(
        //     (banner, recomendList) => {
        //         let banners = banner.data.banners.map(item => {
        //             return { imageUrl: item.imageUrl, typeTitle: item.typeTitle, targetId: item.targetId, }
        //         })
        //         this.setState({ banners, recomendList: recomendList.data.result })
        //     }
        // ))
        this.getBanner().then(res => {
            let banners = res.data.banners.map(item => {
                return { imageUrl: item.imageUrl, typeTitle: item.typeTitle, targetId: item.targetId, }
            })
            this.setState({ banners })
        })
        this.getRecomendList().then(res => {
            this.setState({ recomendList: res.data.result.slice(0, 8) })
        })

        let userInfo = {
            "level": 9,
            "listenSongs": 8530,
            "userPoint": {
                "userId": 111736605,
                "balance": 2060,
                "updateTime": 1551940239300,
                "version": 10,
                "status": 1,
                "blockBalance": 0
            },
            "mobileSign": true,
            "pcSign": true,
            "profile": {
                "experts": {},
                "backgroundUrl": "http://p1.music.126.net/EMyKmC0MtED8VRbIARcD-w==/109951163896706530.jpg",
                "djStatus": 0,
                "detailDescription": "",
                "avatarImgIdStr": "109951163891931524",
                "backgroundImgIdStr": "109951163896706530",
                "backgroundImgId": 109951163896706530,
                "userType": 0,
                "followed": false,
                "vipType": 11,
                "avatarImgId": 109951163891931520,
                "gender": 1,
                "accountStatus": 0,
                "nickname": "-皆随你",
                "birthday": 819388800000,
                "city": 360200,
                "province": 360000,
                "defaultAvatar": false,
                "avatarUrl": "https://p1.music.126.net/UJ2rc2m5K3qevsR72VRvMw==/109951163891931524.jpg",
                "userId": 111736605,
                "description": "",
                "mutual": false,
                "remarkName": null,
                "expertTags": null,
                "authStatus": 0,
                "signature": "你好，再见。",
                "authority": 0,
                "avatarImgId_str": "109951163891931524",
                "artistIdentity": [],
                "followeds": 15,
                "follows": 16,
                "cCount": 0,
                "blacklist": false,
                "eventCount": 2,
                "sDJPCount": 0,
                "allSubscribedCount": 0,
                "playlistCount": 5,
                "playlistBeSubscribedCount": 0,
                "sCount": 0
            },
        }
        this.setState({ userInfo })
    }

    handelBannerShow(type) {
        type === 'right' ? this.carousel.next() : this.carousel.prev()
    }
    toPlaylist(e){
        if(e.target.dataset.id){
            this.props.history.push('/playlist/'+e.target.dataset.id)
        }
    }
    render() {
        const { banners, recomendList, userInfo } = this.state
        return (
            <div>
                <div className="banner">
                    <div>
                        <Icon type="left" className='prev' onClick={this.handelBannerShow.bind(this, 'left')} />
                    </div>
                    <div className='my-carousel'>
                        <Carousel effect="fade" autoplay ref={el => { this.carousel = el }}>
                            {banners.map(item =>
                                <div key={item.targetId} id={item.targetId}>
                                    <img className="banner-img" src={item.imageUrl} alt="banner" />
                                </div>
                            )}
                        </Carousel>
                    </div>
                    <div>
                        <Icon type="right" className='next' onClick={this.handelBannerShow.bind(this, 'right')} />
                    </div>
                </div>

                <div className='content-main'>
                    <div style={{margin:'auto',display:'flex'}}>
                        <div className='content-right'>
                            <div className='content-list' onClick={this.toPlaylist.bind(this)}>
                                {
                                    recomendList.map(item =>
                                        <div className='content-info' key={item.id}>
                                            <div className='list-div' style={{ backgroundImage: `url(${item.picUrl})` }} data-id={item.id}>
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
                        </div>
                        <div className='content-left'>
                            <div>
                                <div className='user'>
                                    <div className='user-avatar'><Avatar shape="square" size={84} src={userInfo.profile.avatarUrl} /></div>
                                    <div>
                                        <div>{userInfo.profile.nickname}</div>
                                        <div>{userInfo.level}</div>
                                        <div>签到</div>
                                    </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home