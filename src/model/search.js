import { getCookie } from "../page/login"


// const host = "https://music.wangsr.cn/api"
const host = "http://127.0.0.1:5000"
const myRequest = async (url, options) => {
  console.log(options)

  let response = await fetch(url, options)

  console.log("response", response)
  return response.json();
};
// const getCaches = async (url) => {
//   let response = await caches.match(url).then(
//      function(response){
//       return response || url
//     }
//   )
//   return response

//   // let response = await fetch(url, options)

//   // console.log("response", response)
//   // return response.json();
// };

export default {
  namespace: 'search',
  state: {
    counter: 1,
    currentPlayIndex: -1,
    currentPlayList: [],
    searchResults: [],
    spin: false,
    listState: "none",
    serverList: [],
    recentList: [],
    isPlay: false
  },
  effects: {
    *searchSongs({ payload: { type: type, keyWord: keyWord } }, sagaEffects) {

      const { call, put } = sagaEffects;
      let result = [];
      yield put({ type: 'setState', payload: true });
      console.log("paload", keyWord)
      const URI = host + "/searchSongs?type="+type+"&keyword=" + keyWord
      result = yield call(myRequest, URI);
      console.log(">>>>>", result)

      // console.log("begin");



      yield put({ type: 'getSongData', payload: result });
      // yield put({ type: 'setState', payload: [false,"block"] });

    },
    *getCollections(_, sagaEffects) {
      const { call, put } = sagaEffects;

      const URI = host + "/getCollections?user=" + getCookie('username')
      console.log("begin");
      const result = yield call(myRequest, URI);
      console.log(result)

      yield put({ type: 'updateServerList', payload: result });
    },
    *removeCollection({ payload: item }, sagaEffects) {
      const { call, put } = sagaEffects;
      const URI = host + "/removeCollection"
      // console.log("begin");
      const result = yield call(myRequest, URI, { method: 'post', body: JSON.stringify({item:item,username:getCookie('username')}) });
      console.log(result)
      if (result === "success") {
        const URI = host + "/getCollections?user=" + getCookie('username')
        // console.log("begin");
        const result = yield call(myRequest, URI);
        console.log(result)
        yield put({ type: 'updateServerList', payload: result });
        console.log("del success")
      }
      // yield put({ type: 'updateServerList', payload: result });
    },
    *addToCollection({ payload: item }, sagaEffects) {
      const { call, put } = sagaEffects;
      const URI = host + "/downloadSong"
      item['username'] = getCookie("username")
      const result = yield call(myRequest, URI, { method: 'post', body: JSON.stringify(item) });
    },




    *getTopSongs({ payload: payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      const URI = payload['url']
      let songdata = [];
      const result = yield call(myRequest, URI);
      const songlist = result['songlist']
      for (let i = 0; i < 30; i++) {
        songdata.push(yield call(myRequest, "https://api.itooi.cn/music/tencent/song?key=579621905&id=" + songlist[i]['data']['strMediaMid']))

      }

      console.log("top", songdata)
    }

  },

  reducers: {
    setState(state, { payload: spin }) {
      console.log(">>>>>setState")
      return {
        spin: spin,
        currentPlayList: state.currentPlayList,
        searchResults: state.searchResults,
        listState: "block",
        currentPlayIndex: -1,
        isPlay: state.isPlay,
        serverList: state.serverList,
        recentList: state.recentList

      }
    },
    getSongData(state, { payload: result }) {
      console.log(">>>>>getSongData")
      // let arr = [];
      // console.log(result)
      // for (let i = 0; i < result.length; i++) {
      //   arr.push({
      //     id: result[i]['id'],
      //     name: result[i]['name'],
      //     artist: result[i]['singer'],
      //     url: result[i]['url'],
      //     cover: result[i]['pic'],
      //     lrc: result[i]['lrc'],
      //   })
      // }
      return {
        listState: "block",
        searchResults: result,
        spin: false,
        currentPlayList: state.currentPlayList,
        currentPlayIndex: -1,
        isPlay: state.isPlay,
        serverList: state.serverList,
        recentList: state.recentList
      }
    },
    updatePlayState(state, { payload: { type: type, list: list, index: index,item:item } }) {//payload[0]:type  payload[1]:index  ...payload[2]:list
      console.log(">>>>>updatePlayState")
      let currentPlayList;
      let curIndex;
      let isPlay;
      if (type === "play") {
        curIndex = index;
        isPlay = !state.isPlay;
        currentPlayList = list;


      } else if (type === "playcollections") {
        curIndex = index;
        isPlay = !state.isPlay;
        currentPlayList = state.serverList;
      }
      // else if (type === "playTop") {
      //   curIndex = payload[1];
      //   isPlay = !state.isPlay;
      //   currentPlayList = payload[2];
      // }
      else {//add
        currentPlayList = state.currentPlayList.concat(JSON.parse(JSON.stringify(item)));
        // console.log("currentPlayList",currentPlayList)
        curIndex = state.currentPlayIndex;
        isPlay = state.isPlay;
      }

      return {
        spin: state.spin,
        listState: state.listState,
        searchResults: state.searchResults,
        currentPlayList: currentPlayList.slice(),
        currentPlayIndex: curIndex,
        serverList: state.serverList,
        isPlay: isPlay,
        recentList: state.recentList
      }
    },
    updateServerList(state, { payload: result }) {
      console.log(">>>>>updateServerList")
      return {
        listState: "block",
        searchResults: state.searchResults,
        spin: false,
        currentPlayList: state.currentPlayList,
        currentPlayIndex: state.currentPlayIndex,
        serverList: result,
        isPlay: state.isPlay,
        recentList: state.recentList

      }
    },
    addToRecentList(state, { payload: payload }) {
      console.log(">>>>>addToRecentList")
      let item = JSON.stringify(payload);
      let arr = state.recentList;
      let arrJSON = state.recentList.map(JSON.stringify)
      let index = arrJSON.indexOf(item);
      if (index !== -1) {
        arr.splice(index, 1);// delete other same id song
      }
      arr.unshift(payload)
      return {
        listState: state.listState,
        searchResults: state.searchResults,
        spin: state.spin,
        currentPlayList: state.currentPlayList,
        currentPlayIndex: state.currentPlayIndex,
        serverList: state.serverList,
        isPlay: state.isPlay,
        recentList: arr
      }
    },
    removeFromList(state, { payload: index }) {
      console.log(">>>>>removeFromList")
      let arr = state.currentPlayList;

      console.log("before", arr)
      arr.splice(index, 1);
      console.log("after", arr)

      return {
        listState: state.listState,
        searchResults: state.searchResults,
        spin: state.spin,
        currentPlayList: arr,
        currentPlayIndex: state.currentPlayIndex,
        serverList: state.serverList,
        isPlay: state.isPlay,
        recentList: state.recentList
      }
    },
  }
};