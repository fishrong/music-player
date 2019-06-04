import React, { Component } from 'react';
import { List, Avatar, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import {getCookie} from "./login"

const TabPane = Tabs.TabPane;
const data = []
const namespace = 'search';
const mapStateToProps = (state) => {
  const serverList = state[namespace].serverList;
  const recentList = state[namespace].recentList;
  return {
    serverList,
    recentList
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getCollections() {
      const action = {
        type: `${namespace}/getCollections`,
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
export default class MyPage extends Component {
  constructor(props){
    super(props);
    // this.props.getCollections();
    console.log("user>>>",getCookie('username'))
  }

  tabOnchange(key) {
    if (key === "1") {
      console.log(key)
      this.props.getCollections()
    }

  }
  play(e, item) {
    let index = this.props.serverList.indexOf(item);
    this.props.updatePlayState({type:"playcollections",index:index});
    console.log(this.props.serverList.indexOf(item))
  }
  remove(e,item){
    console.log(item)
    this.props.removeCollection(item);

  }
  addToList(e,item){
    this.props.updatePlayState({type:'add',item:item});
  }
  render() {
    return (
      <Tabs defaultActiveKey="2" onChange={(key) => { this.tabOnchange(key) }}>
        <TabPane tab={<span><Icon type="heart" />我的收藏</span>} key="1">
          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}

            bordered
            dataSource={this.props.serverList}
            renderItem={item =>
              (<List.Item actions={[<Icon onClick={(e) => this.play(e, item)} type="play-circle" />,
              <Icon type="heart" onClick={(e)=>this.remove(e,item['id'])} theme="twoTone" twoToneColor="#eb2f96" />,
              <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                <List.Item.Meta
                  avatar={<Avatar src={item['cover']} />}
                  title={<a>{item['name']}</a>}
                  description={item['artist']}
                />
                {/* <div>{item['singer']}</div> */}

              </List.Item>)}

          />
        </TabPane>
        <TabPane tab={<span><Icon type="clock-circle" />最近播放</span>} key="2">
          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}

            bordered
            dataSource={this.props.recentList}
            renderItem={item =>
              (<List.Item actions={[<Icon onClick={(e) => this.play(e, item)} type="play-circle" />,
              <Icon type="heart"  />,
              <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                <List.Item.Meta
                  avatar={<Avatar src={item['cover']} />}
                  title={<a>{item['name']}</a>}
                  description={item['artist']}
                />
                {/* <div>{item['singer']}</div> */}

              </List.Item>)}

          />
        </TabPane>
      </Tabs>)
  }
}