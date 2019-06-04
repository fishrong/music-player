import React, { Component } from 'react';
import { List, Input, Spin, Empty, Icon, Avatar, message, Tabs, ConfigProvider } from 'antd';
import { connect } from 'dva';
import myStyle from './search.css'

const TabPane = Tabs.TabPane;

const Search = Input.Search;
const namespace = 'search';

var isLoad = false

const mapStateToProps = (state) => {
  const results = state[namespace].searchResults;
  const spin = state[namespace].spin;
  const listState = state[namespace].listState;
  const serverList = state[namespace].serverList;
  return {
    results,
    spin,
    listState,
    serverList

  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onClickSearch: (type,keyWord) => {
      const action = {
        type: `${namespace}/searchSongs`,
        payload: {type:type,keyWord:keyWord}

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
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchPage extends Component {
  constructor(props) {
    super(props);

    
    // console.log("props", this.state)
    this.props.getCollections()
    console.log(">>>>>>>>>>search construte")
    this.state = { collections: [], selectTab:'1',qqResult: [], wangyiResult: [],kugouResult:[],keyWord:'' };

  }
  componentDidUpdate(prevProps) {
    console.log("searchpage update", prevProps.serverList, this.props.serverList)
    // console.log("update collection",this.state.collections)
    if (prevProps.serverList !== this.props.serverList) {
      let collections = []
      for (let i = 0; i < this.props.serverList.length; i++) {
        collections.push(this.props.serverList[i]['id'])
      }
      this.setState({ collections: collections })
      console.log("search_Collections", collections)
    }

    if (prevProps.results !== this.props.results) {
      if(this.state.selectTab==='1'){
        this.setState({ qqResult: this.props.results })
      }
      else if(this.state.selectTab==='3'){
        this.setState({ wangyiResult: this.props.results })
      }

      else if(this.state.selectTab==='2'){
        this.setState({ kugouResult: this.props.results })
      }

      
      console.log(">>>>>>qqResult", this.state.qqResult)
      console.log(">>>>>>wangyiResult", this.state.wangyiResult)
    }

  }





  play(list, index) {
    // let index = this.props.results.indexOf(item);
    this.props.updatePlayState({type:'play',list:list,index:index});

    console.log("play index",index)
  }
  addToList(e, item) {
    this.props.updatePlayState({type:'add',item:item});
  }
  // addToCollection(item){
  //   console.log(item)
  // }
  changeTabs(key) {
    if(key==='1'){
        if(this.state.qqResult.length===0 && this.state.keyWord.length!==0){
          this.props.onClickSearch('qq',this.state.keyWord);
        }
    }else if(key==='2'){
      if(this.state.kugouResult.length===0 && this.state.keyWord.length!==0){
        this.props.onClickSearch('kugou',this.state.keyWord);
      }
    }else{
      
      if(this.state.wangyiResult.length===0 && this.state.keyWord.length!==0){
        this.props.onClickSearch('wangyiyun',this.state.keyWord);
      }
    }
    this.setState({selectTab:key})
    console.log("keys", key)
  }
  searchSongs(value){
    this.setState({keyWord:value,qqResult:[],wangyiResult:[],kugouResult:[]})
    if(this.state.selectTab==='1'){
      this.props.onClickSearch("qq",value)
    }else if(this.state.selectTab==='3'){
      console.log("search 163......")
      this.props.onClickSearch('wangyiyun',value)
    }

    else if(this.state.selectTab==='2'){
      console.log("search kugou......")
      this.props.onClickSearch('kugou',value)
    }
  }
  render() {
    return (
      <div>

        <Search
          placeholder="so yi so ~"
          size="large"
          onSearch={(value) => { this.searchSongs(value)}}
          enterButton
        />
         
        <Tabs defaultActiveKey="1" onChange={(key) => { this.changeTabs(key) }}>
          <TabPane tab="QQ音乐" key="1">
            <Spin spinning={this.props.spin}>
              <div style={{ display: this.props.listState }}>
                <List
                  // header={<div>Header</div>}
                  // footer={<div>Footer</div>}

                  bordered
                  dataSource={this.state.qqResult}
                  renderItem={item =>
                    (<List.Item actions={[<Icon onClick={() => this.play(this.state.qqResult, this.state.qqResult.indexOf(item))} type="play-circle" />,
                    this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                      <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                      ,
                    <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                      <List.Item.Meta
                        avatar={<Avatar src={item['cover']} />}
                        title={<a>{item['name']}</a>}
                        description={item['artist']}
                      />
                      {/* <div>{item['singer']}</div> */}

                    </List.Item>)}

                /></div>

            </Spin>


          </TabPane>
          <TabPane tab="酷狗" key="2"><Spin spinning={this.props.spin}>
              <div style={{ display: this.props.listState }}>
                <List
                  // header={<div>Header</div>}
                  // footer={<div>Footer</div>}

                  bordered
                  dataSource={this.state.kugouResult}
                  renderItem={item =>
                    (<List.Item actions={[<Icon onClick={(e) => this.play(this.state.kugouResult, this.state.kugouResult.indexOf(item))} type="play-circle" />,
                    this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                      <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                      ,
                    <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                      <List.Item.Meta
                        avatar={<Avatar src={item['cover']} />}
                        title={<a>{item['name']}</a>}
                        description={item['artist']}
                      />
                      {/* <div>{item['singer']}</div> */}

                    </List.Item>)}

                /></div>

            </Spin></TabPane>
          <TabPane tab="网易云" key="3">
            <Spin spinning={this.props.spin}>
              <div style={{ display: this.props.listState }}>
                <List
                  // header={<div>Header</div>}
                  // footer={<div>Footer</div>}

                  bordered
                  dataSource={this.state.wangyiResult}
                  renderItem={item =>
                    (<List.Item actions={[<Icon onClick={(e) => this.play(this.state.wangyiResult, this.state.wangyiResult.indexOf(item))} type="play-circle" />,
                    this.state.collections.indexOf(item['id']) === -1 ? <Icon type="heart" onClick={() => { this.props.addToCollection(item) }} /> :
                      <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                      ,
                    <Icon type="plus" onClick={(e) => this.addToList(e, item)} />]}>
                      <List.Item.Meta
                        avatar={<Avatar src={item['cover']} />}
                        title={<a>{item['name']}</a>}
                        description={item['artist']}
                      />
                      {/* <div>{item['singer']}</div> */}

                    </List.Item>)}

                /></div>

            </Spin>
          </TabPane>
        </Tabs>
        





      </div>

    )
  }
}

