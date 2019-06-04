import {
    Form, Icon, Input, Button, Checkbox,
  } from 'antd';
  import router from 'umi/router';
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
export function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
 export default class NormalLoginForm extends React.Component {
   constructor(props){
     super(props);
     window.onresize = this.resize;
     this.state={isMobile:document.body.clientWidth<400? true:false}
   }
    handleSubmit = (e) => {
      e.preventDefault();
      let form = new FormData(document.getElementById('loginform'))
      let xhr = new XMLHttpRequest();
      xhr.open('post','https://music.wangsr.cn/api/login')
      xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            if(xhr.responseText!=="error"){
                setCookie("username",xhr.responseText,1)
                // console.log(getCookie("username"))
                router.push('/my');
            }
          console.log(xhr.responseText)
        }
      }
      xhr.send(form);
        console.log(e)
    }
    resize = ()=>{
      this.setState({
       isMobile:document.body.clientWidth<400? true:false
      })
    }
  
    render() {
      return (
        <Form id="loginform"  onSubmit={this.handleSubmit} style={{marginTop:'10%',marginLeft:this.state.isMobile?'10%':'35%',width:this.state.isMobile?'80%':'30%'}}>
           <Form.Item>
          
            <Input name="name" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
        </Form.Item>
        <Form.Item>
      
            <Input name="pwd" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
   
        </Form.Item>
        <Form.Item>
       
            <Checkbox>Remember me</Checkbox>
        &nbsp;&nbsp;&nbsp;&nbsp;
          <a className="login-form-forgot" href="">Forgot password</a>
          <br/>
          <Button type="primary" htmlType="submit" style={{width:'100%'}}>
            Log in
          </Button>
          <br/>
          Or <a href="">register now!</a>
        </Form.Item>
        </Form>
      );
    }
  }
  
