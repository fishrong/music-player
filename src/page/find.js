
import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Tabs, Skeleton, List, Avatar, message } from 'antd';
import { connect } from 'dva';
import { getCookie } from "../page/login"
const TabPane = Tabs.TabPane;
const results = [{
  name: '画心',
  artist: "杨坤/A-Lin",
  url: "https://api.itooi.cn/music/tencent/url?id=000Cubqa3VgCrk&key=579621905",
  cover: "https://api.itooi.cn/music/tencent/pic?id=000Cubqa3VgCrk&key=579621905",
  lrc: "https://api.itooi.cn/music/tencent/lrc?id=000Cubqa3VgCrk&key=579621905",
  theme: '#ebd0c2'
}]
var loadData = {
  'tab1': false,
  'tab2': false,
  'tab3': false

}
var listData = {
  'tab1': [],
  'tab2': [],
  'tab3': []
}
const namespace = 'search';
const mapStateToProps = (state) => {
  const serverList = state[namespace].serverList;
  const tab1Content = state['top'].tab1Content;
  const tab2Content = state['top'].tab2Content;
  const tab3Content = state['top'].tab3Content;

  return {
    serverList,
    tab1Content, tab2Content, tab3Content

  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getTopSongs(payload) {
      const action = {
        type: `${"top"}/getTopSongs`,
        payload: payload
      };
      dispatch(action);
    },
    updatePlayState: (payload) => {
      const action = {
        type: `${namespace}/updatePlayState`,
        payload: payload

      };
      dispatch(action);
    },

    addToCollection: (payload) => {
      if (getCookie('username') === '') {
        message.warning('请登录进行操作');
        return;
      }
      message.success('正在添加到收藏，请稍后查看');
      const action = {
        type: `${namespace}/addToCollection`,
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
    removeCollection: (payload) => {
      const action = {
        type: `${namespace}/removeCollection`,
        payload: payload

      };
      dispatch(action);
    },

  };
};
@connect(mapStateToProps, mapDispatchToProps)
export default class FindPage extends Component {
  constructor(props) {
    super(props)
    this.props.getCollections()
    const menu = (
      <Menu>
        <Menu.Item onClick={() => { this.updateTabs("QQ") }}>
          <a >QQ</a>
        </Menu.Item>
        <Menu.Item onClick={() => { this.updateTabs("kugou") }}>
          <a >酷狗</a>
        </Menu.Item>
        <Menu.Item onClick={() => { this.updateTabs("wangyiyun") }}>
          <a>网易云</a>
        </Menu.Item>
      </Menu>
    );
    this.state = {
      menu: menu, select: "QQ", tab1: "流行指数", tab2: "热歌", tab3: "网络歌曲榜",
      tab1Content: [1, 2, 3], tab2Content: [1, 2, 3], tab3Content: [1, 2, 3],
      loadtab1: false, loadtab2: false, loadtab3: false, activeKey: '1', collections: []
    }

    this.props.getTopSongs({ type: 'qq', id: 4, tab: 'tab1' });

    console.log("find loadData....")


    // this.props.getTopSongs({id:4,url:'/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=4&_=1512563984096'});


  }
  componentDidUpdate(prevProps) {
    if (prevProps.tab1Content !== this.props.tab1Content) {

      this.setState({
        loadtab1: true, tab1Content: this.props.tab1Content
      })
    }
    if (prevProps.tab2Content !== this.props.tab2Content) {
      this.setState({
        loadtab2: true, tab2Content: this.props.tab2Content
      })
    }
    if (prevProps.tab3Content !== this.props.tab3Content) {
      this.setState({
        loadtab3: true, tab3Content: this.props.tab3Content
      })
    }
    if (prevProps.serverList !== this.props.serverList) {
      let collections = []
      for (let i = 0; i < this.props.serverList.length; i++) {
        collections.push(this.props.serverList[i]['id'])
      }
      this.setState({ collections: collections })

    }
    console.log("find update..state", this.state)
  }

  updateTabs(type) { //draw
    if (type === "QQ") {
      this.setState({
        tab1: "流行指数", tab2: "热歌", tab3: "网络歌曲榜", select: "QQ"
      })
    } else if (type === "kugou") {
      this.setState({
        tab1: "飙升榜", tab2: "TOP500", tab3: "网络红歌榜", select: "酷狗"
      })
    }
    else if (type === "wangyiyun") {

      this.setState({
        tab1: "飙升榜", tab2: "新歌榜", tab3: "热歌榜", select: "网易云", activeKey: "1"
      })
      this.props.getTopSongs({ type: 'wangyiyun', id: 3778678, tab: 'tab' + this.state.activeKey });

    }

  }
  play(list, index) {
    // let tab;
    // switch (tabtype) {
    //   case "QQtab1": tab = this.props.QQtab1; break;
    //   case "QQtab2": tab = this.props.QQtab2; break;
    //   case "QQtab3": tab = this.props.QQtab3; break;
    // }
    // let index = tab.indexOf(item);
    // this.props.updatePlayState(["playTop", index, tab]);

    this.props.updatePlayState({ type: 'play', list: list, index: index });
    // console.log("type", tabtype)
    // console.log("type",tab)
    // console.log(tab.indexOf(item))
  }
  addToList(e, item) {
    this.props.updatePlayState({type:"add",item:item});
  }

  tabCallback(key) {//switch tab

    this.setState({ activeKey: key })

    console.log(">>>>>>switch tabs", key)
    if (this.state.select === "QQ") {
      if (key === '1' && !this.state.loadtab1) {
        this.props.getTopSongs({ type: 'qq', id: 4, tab: 'tab1' });

      }
      else if (key === '2' && !this.state.loadtab2) {
        this.props.getTopSongs({ type: 'qq', id: 26, tab: 'tab2' });

      }
      else if (key === '3' && !this.state.loadtab3) {
        this.props.getTopSongs({ type: 'qq', id: 28, tab: 'tab3' });

      }

    }
    if (this.state.select === "网易云") {
      if (key === '1' && !this.state.loadtab1) {
        this.props.getTopSongs({ type: 'wangyiyun', id: 19723756, tab: 'tab1' });

      }
      else if (key === '2' && !this.state.loadtab2) {
        this.props.getTopSongs({ type: 'wangyiyun', id: 3779629, tab: 'tab2' });

      }
      else if (key === '3' && !this.state.loadtab3) {
        this.props.getTopSongs({ type: 'wangyiyun', id: 3778678, tab: 'tab3' });

      }

    }
    // console.log("key", key, this.state.select)
    // console.log(this.props.tab1Content)
  }

  render() {
    return (
      <Tabs activeKey={this.state.activeKey}
        tabBarExtraContent={<Dropdown overlay={this.state.menu}>
          <a className="ant-dropdown-link" href="#">
            {this.state.select} <Icon type="down" />
          </a>
        </Dropdown>} onChange={(key) => { this.tabCallback(key) }}>
        <TabPane tab={this.state.tab1} key="1">

          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            style={{ height: '350px', overflow: 'scroll' }}
            footer={this.state.loadtab1 && <div>木有了～</div>}
            bordered
            dataSource={this.state.tab1Content}
            renderItem={item =>
              (<List.Item actions={this.state.loadtab1 && [<Icon onClick={() => this.play(this.state.tab1Content, this.state.tab1Content.indexOf(item))} type="play-circle" />,
              this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                      <Icon type="heart" onClick={()=>this.props.removeCollection(item['id'])} theme="twoTone" twoToneColor="#eb2f96" />
                ,
              <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                <Skeleton loading={!this.state.loadtab1} active avatar>
                  <List.Item.Meta style={{ overflow: 'hidden', whiteSpace: 'nowrap', cursor: 'default' }}
                    avatar={<Avatar src={item['cover']} />}
                    title={item['name']}
                    description={item['artist']}
                  />
                </Skeleton>

              </List.Item>)

            }

          />

          {/* <div style={{height:'90px'}}></div> */}
        </TabPane>
        <TabPane tab={this.state.tab2} key="2">
          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            style={{ height: '350px', overflow: 'scroll' }}
            footer={this.state.loadtab2 && <div>木有了～</div>}
            bordered
            dataSource={this.state.tab2Content}
            renderItem={item =>
              (<List.Item actions={this.state.loadtab2 && [<Icon onClick={() => this.play(this.state.tab2Content, this.state.tab2Content.indexOf(item))} type="play-circle" />,
              this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                      <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                ,
              <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                <Skeleton loading={!this.state.loadtab2} active avatar>
                  <List.Item.Meta style={{ overflow: 'hidden', whiteSpace: 'nowrap', cursor: 'default' }}
                    avatar={<Avatar src={item['cover']} />}
                    title={item['name']}
                    description={item['artist']}
                  />
                </Skeleton>

              </List.Item>)

            }

          />

        </TabPane>
        <TabPane tab={this.state.tab3} key="3">
          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            style={{ height: '350px', overflow: 'scroll' }}
            footer={this.state.loadtab3 && <div>木有了～</div>}
            bordered
            dataSource={this.state.tab3Content}
            renderItem={item =>
              (<List.Item actions={this.state.loadtab3 && [<Icon onClick={() => this.play(this.state.tab3Content, this.state.tab3Content.indexOf(item))} type="play-circle" />,
              this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                      <Icon type="heart"  theme="twoTone" twoToneColor="#eb2f96" />
                ,
              <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                <Skeleton loading={!this.state.loadtab3} active avatar>
                  <List.Item.Meta style={{ overflow: 'hidden', whiteSpace: 'nowrap', cursor: 'default' }}
                    avatar={<Avatar src={item['cover']} />}
                    title={item['name']}
                    description={item['artist']}
                  />
                </Skeleton>

              </List.Item>)

            }

          />
        </TabPane>
      </Tabs>)
  }
}