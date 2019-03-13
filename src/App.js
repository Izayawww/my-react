import React, { Component } from 'react'
import {
  Layout, Menu, Icon, Input, Dropdown
} from 'antd';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Home from './home/Home'
import MyMusic from './my-music/my-music'
import PlaylistComp from './playlist/playlist'
import Song from './song/song'
import Playlistpage from './playlistpage/playlistpage'
import Myhomepage from './myhomepage/myhomepage'
import './App.scss'
const { Content } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to='/myhomepage'>我的主页</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <span>我的消息</span>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <span>个人设置</span>
    </Menu.Item>
  </Menu>
);
const IconFont = Icon.createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_883876_h3y2yo43haj.js' })
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: null,
    }
  }

  render() {
    return (
      <Layout>
        <div className="header">
          <div className='header-menu'>
            <div style={{ display: 'flex' }}>
              <Router>
                <Menu
                  mode="horizontal"
                  theme="dark"
                  defaultSelectedKeys={['2']}
                  style={{ height: 64, lineHeight: '60px' }}
                >
                  <Menu.Item key="1" className='first-item' style={{ color: 'white', fontSize: 18 }}><IconFont type="icon-wangyiyunyinle" />网易云音乐</Menu.Item>
                  <Menu.Item key="2"><Link to='/home'>发现音乐</Link></Menu.Item>
                  <Menu.Item key="3"><Link to='/mymusic'>我的音乐</Link></Menu.Item>
                  <Menu.Item key="4">朋友</Menu.Item>
                  <Menu.Item key="5">商城</Menu.Item>
                  <Menu.Item key="6">音乐人</Menu.Item>
                  <Menu.Item key="7">下载客户端</Menu.Item>
                </Menu>
              </Router>
              <div className='header-right'>
                <Input prefix={<Icon type="search" />} style={{ borderRadius: '30px' }} placeholder="音乐/视频/电台/用户" />
                <div><span className="create-btn">创作者中心</span></div>
                <div>
                  <Router>
                    <Dropdown overlay={menu}>
                      <div className='avatar-menu'>
                      <img className='user-avatar' src="http://p4.music.126.net/UJ2rc2m5K3qevsR72VRvMw==/109951163891931524.jpg?param=30y30" alt="头像" />
                      <Icon type="caret-down" />
                      </div>
                    </Dropdown>
                  </Router>
                </div>
              </div>
            </div>
          </div>
          <Router>
            <ul className='header-sub-ul'>
              <li><span className='active'>推荐</span></li>
              <li><span>排行榜</span></li>
              <li><span><Link to="/playlistpage">歌单</Link></span></li>
              <li><span>主播电台</span></li>
              <li><span>歌手</span></li>
              <li><span>排行版</span></li>
            </ul>
          </Router>
        </div>
        <Content className='app-content'>
          <Router>
            <div>
              <Route path='/' exact render={() => (<Redirect to='/home' />)}></Route>
              <Route path='/home' component={Home}></Route>
              <Route path='/mymusic' component={MyMusic}></Route>
              <Route path='/playlist/:id' component={PlaylistComp}></Route>
              <Route path='/song/:id' component={Song}></Route>
              <Route path='/playlistpage' component={Playlistpage}></Route>
              <Route path='/myhomepage' component={Myhomepage}></Route>
            </div>
          </Router>
        </Content>
      </Layout >
    )
  }
}
export default App;
