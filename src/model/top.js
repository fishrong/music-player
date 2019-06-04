const host = "http://127.0.0.1:5000"
// const host = "https://music.wangsr.cn/api"
const myRequest = async (url, options) => {
    // console.log(options)
  
    let response = await fetch(url, options)
  
    // console.log("response", response)
    return response.json();
  };
  export default {
    namespace: 'top',
    state: {
      toplist:[1,2,3],
      tab1Content:[1,2,3],
      tab2Content:[1,2,3],
      tab3Content:[1,2,3],

    },
    effects: {
      
      *getTopSongs({ payload: {type:type,id:id,tab:tab} }, sagaEffects) {
        const { call, put } = sagaEffects;
        
      
  
        let res = yield call(myRequest, host+"/gettoplist?type="+type+"&id="+id)
      
        yield put({ type: 'getSongData', payload: {result:res,tab:tab} });
        console.log("top_"+id,res)
        // console.log(res[0]['lrc'])
      }
  
    },
  
    reducers: {
      getSongData(state, { payload: {result:res,tab:tab}}) {
        console.log("top>>>>>>tab",tab)
        
        
        return {
          tab1Content:tab==="tab1"? res:state.tab1Content,//liu xing
          tab2Content:tab==="tab2"? res:state.tab2Content,//re ge
          tab3Content:tab==="tab3"? res:state.tab3Content,//wangluo
        }
      }
    }
  };