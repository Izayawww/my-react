import React, { Component } from 'react'
import { Icon,Pagination,Skeleton } from 'antd';
import axios from 'axios'
import './index.scss'
axios.defaults.baseURL = 'http://134.175.224.127:7003';
class Playlistpage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recomendList:[],
            listCats:[],
            total:0,
            cat:'全部',
            page:1,
        }
    }


    componentWillMount() {
        this.getPlayList()
        this.getListCats()
    }

    getPlayList(page=1,type='hot',cat) {
        cat = this.state.cat
        axios.get(`/top/playlist?limit=${page*35}&order=${type}&cat=${cat}`).then(res => {
            let recomendList = res.data.playlists.map(item => {
                return { id: item.id, name: item.name, playCount: item.playCount, imgUrl: item.coverImgUrl, trackCount: item.trackCount, creator: item.creator.nickname }
            })
            let total =res.data.total
            this.setState({ recomendList,total })
        })
    }

    getListCats(){
        axios.get('/playlist/hot').then(res=>{
            let listCats = res.data.tags.map(item => item.name)
            this.setState({listCats})
        })
    }

    toPlaylist(e) {
        if (e.target.dataset.id) {
            this.props.history.push('/playlist/' + e.target.dataset.id)
        }
    }

    changeCat(e){
        this.getPlayList(1,'hot',e.target.dataset.id)
        this.setState({cat:e.target.dataset.id})
    }

    pageChange(page){
        this.getPlayList(page)
        this.setState({page})
    }

    render() {
        const { recomendList, listCats, total, page } = this.state
        return (
            <div className='content-main'>
                <div style={{ margin: 'auto', display: 'flex' }}>
                    <div className='content-right'>
                        <div className='content-title'>
                            <div className='circle-title'></div>
                            <span className='content-titlename'>热门歌单</span>
                            <ul className='playlist-cats' onClick={this.changeCat.bind(this)}>
                                {listCats.map(item=>
                                <li key={item} data-id={item}>{item}</li>
                                )}
                            </ul>
                        </div>
                        <div className='content-list' onClick={this.toPlaylist.bind(this)}>
                            {recomendList.slice((page-1)*35,(page-1)*35+35).length>0?
                            (
                                recomendList.slice((page-1)*35,(page-1)*35+35).map(item =>
                                    <div className='content-info' key={item.id}>
                                        <div className='list-div' title={item.name} style={{ backgroundImage: `url(${item.imgUrl})` }} data-id={item.id}>
                                            <div className='list-play'> 
                                                <div>
                                                    <Icon type="customer-service" />
                                                    <span className='play-count'>{item.playCount > 10000 ? parseInt(item.playCount / 10000) + '万' : item.playCount}</span>
                                                </div>
                                                <Icon type="play-circle" className='play-icon' />
                                            </div>
                                        </div>
                                        <div className='content-name'>
                                            <div className='playlist-name'>{item.name}</div>
                                            <span className='playlist-creator'>by {item.creator}</span>
                                        </div>
                                    </div>
                                )
                            ):<Skeleton active paragraph={{ rows: 6, width: [480, 680, 820, 650, 700, 730] }} title={false} />}
                        </div>
                    </div>
                </div>
                <Pagination className='list-pagination' onChange={this.pageChange.bind(this)} size="small"  pageSize={35} total={total} />
            </div>
        )
    }
}
export default Playlistpage