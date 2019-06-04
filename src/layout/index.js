import { Component } from 'react';
import { Layout, Menu, Avatar, Typography, Icon, Affix, Button, message, Drawer, List, Row, Col } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;
// 引入子菜单组件
const SubMenu = Menu.SubMenu;
import React from 'react';
import ReactAplayer from 'react-aplayer';
import { getCookie } from "../page/login"

const namespace = 'search';
const mapStateToProps = (state) => {
  const audioData = state[namespace].currentPlayList;
  const currentPlayIndex = state[namespace].currentPlayIndex;
  const isPlay = state[namespace].isPlay;
  const serverList = state[namespace].serverList;

  return {
    audioData,
    currentPlayIndex,
    isPlay,
    serverList

  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onClickSearch: () => {
      const action = {
        type: `${namespace}/searchSongs`,

      };
      dispatch(action);
    },

    addToRecentList: (payload) => {
      const action = {
        type: `${namespace}/addToRecentList`,
        payload: payload

      };
      dispatch(action);
    },
    addToCollection: (payload) => {
      message.success('正在添加到收藏，请稍后查看');
      const action = {
        type: `${namespace}/addToCollection`,
        payload: payload

      };
      dispatch(action);
    },//removeFromList
    removeFromList: (payload) => {
      const action = {
        type: `${namespace}/removeFromList`,
        payload: payload

      };
      dispatch(action);
    },
    getCollections() {
      const action = {
        type: `${namespace}/getCollections`,
      };
      dispatch(action);
    },
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class BasicLayout extends Component {
  constructor(props) {
    super(props);

    console.log(">>>>props", document.body.clientWidth)
    this.props.getCollections()
    
    window.onresize = this.resize;
    this.state = { collections: [], visible: false, index: 0, user: getCookie('username'),isMobile:document.body.clientWidth<400? true:false };

  }

  resize = ()=>{
    this.setState({
     isMobile:document.body.clientWidth<400? true:false
    })
  }
  
  showDrawer = () => {
    this.setState({
      visible: true,
    });
    // console.log(this.state)
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  onPlay = () => {
    // this.props.addToRecentList(this.ap.list['audios'])

    let audio = this.ap.list['audios'];
    let index = this.ap.list['index'];
    this.setState({
      index: index,
    });
    this.props.addToRecentList(audio[index])
    console.log('on play', this.ap);
    // console.log("index",index)
    console.log("audiodata", this.props.audioData)
  };

  onPause = () => {
    console.log('on pause');
  };
  onListshow = () => {

    console.log('on show')
  }

  // example of access aplayer instance
  onInit = ap => {
    this.ap = ap;
  };
  addSong = (audioData) => {
    this.ap.list.add(audioData);
    console.log("add")
  }
  /**
   * change the default playlist's direction
   */
  changeListDirection() {
    let player = document.getElementsByClassName('aplayer');
    let list = document.getElementsByClassName('aplayer-list');
    let body = document.getElementsByClassName('aplayer-body');
    player[0].insertBefore(list[0], body[0])
  }
  componentDidMount() {
    let aplayer = document.getElementsByClassName("aplayer");
    aplayer[0].style.margin = "0"
    let list = document.getElementsByClassName("aplayer-icon-menu")
    list[0].addEventListener('click', () => { console.log(">>>>>"); this.ap.list.hide(); this.showDrawer() })

    console.log("mount")
  }
  componentDidUpdate(prevProps) {
    // this.ap.list.hide()
    console.log("prevProps", prevProps.isPlay, this.props.isPlay)
    if (prevProps.isPlay !== this.props.isPlay) {
      console.log(">>>>>>>", this.props.currentPlayIndex)
      this.ap.list.clear();

      this.ap.list.add(this.props.audioData);
      this.changeListDirection();
      this.ap.list.switch(this.props.currentPlayIndex)
      this.ap.play()
    }
    if (this.props.audioData.length !== this.ap.list['audios'].length) {
      this.ap.list.add(this.props.audioData[this.props.audioData.length - 1])
      message.success('已添加到播放列表')
    }
    if (prevProps.serverList !== this.props.serverList) {
      let collections = []
      for (let i = 0; i < this.props.serverList.length; i++) {
        collections.push(this.props.serverList[i]['id'])
      }
      this.setState({ collections: collections })
      console.log("index_Collections", collections)
    }
    console.log("index_serlist", this.props.serverList)

    // console.log("data",this.props.audioData)
    // console.log("audio",this.ap.list['audios'])
  }
  removeFromList(item) {

    let index = this.props.audioData.indexOf(item)
    console.log("del", index)
    this.ap.list.remove(index)
    this.props.removeFromList(index)
    // this.forceUpdate()
    this.setState({
      visible: true
    })

  }
  render() {
    const props = {
      // theme: '#F57F17',
      lrcType: 1,
      listFolded: true,
      audio: this.props.audioData
    };
    
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, null, React.Children.map(child.props.children, child => {
        return React.cloneElement(child, { addSong: this.addSong });
      }));
    })

    return (
      <Layout className="layout">
        <Header theme="ligth" style={{ background: '#fff' }}>
          {!this.state.isMobile && <div className="logo" style={{ float: 'left', fontSize: '30px', marginRight: '20px' }}><Icon type="customer-service" theme="twoTone" /></div>}
          <Menu
           
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1" style={{border:'none'}}><Link to="/search">搜索</Link></Menu.Item>
            <Menu.Item key="2" style={{border:'none'}}><Link to="/find">发现</Link></Menu.Item>
            <Menu.Item key="3" style={{border:'none'}}><Link to="/my">我的</Link></Menu.Item>
         
            <Menu.Item key="4" style={{float:this.state.isMobile?'none':'right'}}>
              {/* <Link to="/login">{this.state.user === '' ? "Login" : this.state.user}
                <Icon type={this.state.user === '' ? "login" : "logout"} />
              </Link> */}
              <Link to="/login">
              <Avatar style={{ backgroundColor: "#f56a00", verticalAlign: 'middle' }} size="large">
              {this.state.user === '' ? "Login" : this.state.user}
              </Avatar>
              </Link>
            </Menu.Item>
            {/* <span style={{ float: 'right' }}>
              <Link to="/login"><Button style={{ border: 'none' }} type="link">{this.state.user === '' ? "Login" : this.state.user}
                <Icon type={this.state.user === '' ? "login" : "logout"} />
              </Button></Link>

            </span> */}



          </Menu>



        </Header>
        <Content style={{ padding: '10px' }}>

          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{childrenWithProps}</div>

          <Affix style={{ position: 'fixed', bottom: '0', right: '0', left: '0' }}>
            <ReactAplayer
              {...props}
              onInit={this.onInit}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onEnded={this.onEnd}
              onListshow={this.onListshow}
              onLoadedmetadata={(e) => { console.log(e) }}
            />

          </Affix>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
    </Footer> */}

        <Drawer
          title="播放列表"
          placement="right"
          width="340"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            size="small"
            // bordered
            dataSource={this.props.audioData}
            renderItem={item =>
              (<List.Item actions={[
                this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                  <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                //  <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96"/>
                ,
                <Icon type="delete" onClick={() => this.removeFromList(item)} />]}>
                <List.Item.Meta style={{ overflow: 'hidden', whiteSpace: 'nowrap', cursor: "pointer" }}
                  onClick={() => { this.ap.list.switch(this.props.audioData.indexOf(item)); this.ap.play() }}
                  avatar={<Avatar src={item['cover']} />}
                  title={this.state.index === this.props.audioData.indexOf(item) ? <Text style={{ color: "#03a9f4" }}>{item['name']}</Text> : item['name']}
                  description={this.state.index === this.props.audioData.indexOf(item) ? <Text style={{ color: "#03a9f4" }}>{item['artist']}</Text> : item['artist']}
                />
                {/* <div>{item['singer']}</div> */}

              </List.Item>)}

          />
        </Drawer>
      </Layout>

    )
  }
}