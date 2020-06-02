<template>
  <div>
    <el-dialog class="chat-dialog" :close-on-click-modal="false" :visible.sync="dialogVisible" :append-to-body="true">
      <div class="chat-list">
        <ul>
          <li :class="{active:i==0}" v-for="item,i in 9">
            <img src="" border="0" class="img" />
            <div class="right">
              <div class="name-wrap"><span class="name">Alice Alice Alice Alice</span><span class="time">09:12</span></div>
              <div class="content">医生后台原型在哪了医生后台原型在哪了医生后台原型在哪了</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="order-info">
        <div class="content">
          <img src="" border="0" class="img" />
          <div class="right">
            <div class="name">Alice Alice Alice Alice</div>
            <div class="intro">{{$t( '医护' )}}</div>
          </div>
        </div>
        <div>
          <ul class="record" id="record">
            <li class="more" v-show="more" @click="getMoreOrder">{{$t( '加载更多' )}}</li>
            <li v-for="item in beforeMessages">
              <div class="status" v-if="item.all==1">{{item.content}}</div>
              <div v-else-if="item.fromUid!=uid">
                <div class="time">{{item.createTime}}</div>
                <img :src="item.portrait" alt="" class="avatar" />
                <div class="detail" v-if='item.type===1'><img :src="item.content" width="100%" /></div>
                <div v-else class="detail">{{item.content}}
                </div>
                <div class="ke"></div>
              </div>
              <div class="other mine" v-else-if="item.fromUid==uid">
                <div class="ke"></div>
                <div class="time">{{item.createTime}}</div>
                <div class="detail" v-if='item.type===1'>
                  <img :src="item.content" width="100%" />
                </div>
                <div v-else class="detail blue">{{item.content}}

                </div>
                <img :src="item.portrait" alt="" class="avatar" />
              </div>
            </li>
            <li v-for="item in messages">
              <div class="status" v-if="item.all==1">{{item.content}}</div>
              <div v-else-if="item.fromUid!=uid">
                <div class="time">{{item.createTime}}</div>
                <img :src="item.portrait" alt="" class="avatar" />
                <div class="detail" v-if='item.type===1'><img :src="item.content" width="100%" /></div>
                <div v-else class="detail">{{item.content}}
                </div>
                <div class="ke"></div>
              </div>
              <div class="other mine" v-else-if="item.fromUid==uid">
                <div class="ke"></div>
                <div class="time">{{item.createTime}}</div>
                <div class="detail" v-if='item.type===1'>
                  <img :src="item.content" width="100%" />
                </div>
                <div v-else class="detail">{{item.content}}</div>
                <img :src="item.portrait" alt="" class="avatar" />
              </div>
            </li>
          </ul>
          <div class="tools">
            <div class="relative">
              <img src="/static/img/upload.png" alt="" class="img" />
              <input @change='add_img($event,0)' :title="$t( '图片' )" accept="image/png,image/jpeg,image/gif" type="file" id="saveImage" class="input">
            </div>
          </div>
          <div class="send-box">
            <textarea @keyup.ctrl.13="getSocketData" class="input" v-model="dataForm.inputText" ref="inputBox" @keyup="toBottom" :placeholder="$t( '请输入消息' )"></textarea>
            <!--<input type="text" />-->
            <div class="send-wrap">
              {{$t( 'Enter换行,Ctrl+Enter发送' )}}
              <div class="send" @click="getSocketData">{{$t( '发送' )}}</div>
            </div>

          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Chat',
    data() {
      return {
        socket: null,
        lockReconnet: false, //避免重复连接
        wsUrl: "ws://192.168.10.100:8214/chat/05e288da92e94d3c835f5c7bddbf0d78",
        isReconnet: false,
        globalCallback: null,
        sendData: null, //把要发送给socket的数据和处理socket返回数据的回调保存起来
        heartCheckTimeout: 60 * 1000,
        heartCheckTimeoutObj: null,
        heartCheckServerTimeoutObj: null,
        timeoutObj: null,
        serverTimeoutObj: null,
        dialogVisible: false,
        showMessage: false,
        message: '',
        more: false,
        beforeMessages: [],
        messages: [{}],
        amount: '',
        uid: 59,
        chat: {
          'my': {
            'id': '',
            'logo': '',
            'realname': ''
          },
          'user': {
            'id': '',
            'logo': '',
            'realname': ''
          },
          'order_id': '',
          'order_no': '',
          'id': 0,
          'user_id': '',
          'status': 0
        },
        getChatTime: 0,
        dataForm:{
          inputText: '',
          type:0,//0文字，1图片
        },
        location: '',
        onlineTip: '',
        isShowTip: false,
        imgSource: "",
        isReturn: false,
        applicationId: '',
        dataList: [{}],
      }
    },
    methods: {
      init(params) {
        this.createSocket(this.wsUrl)
        this.beforeMessages = []
        this.messages = []
        this.more = false;
        this.applicationId = ''

        this.dialogVisible = true
      },
      initSocket() { //初始化websocket
        this.socket.onopen = () => {
          console.log('websocket connection sucess')
          //        this.heartCheckStart() //后端说暂时不需要做心跳检测

          if(this.isReconnet) { //执行全局回调函数
            //console.log('websocket重新连接了')
            this.sendMsg(this.sendData, this.globalCallback)
            this.isReconnet = false
          }
        }

        this.socket.onmessage = (ev) => {//接收消息
          console.log(ev, 'this.socket.onmessage')
           this.messages.push(JSON.parse(ev.data))
          //        this.heartCheckStart() //后端说暂时不需要做心跳检测
        }

        this.socket.onerror = () => {
          console.log('websocket onerror');
          this.reconnet(this.wsUrl)
        }

        this.socket.onclose = () => {
          console.log('websocket onclose');
          this.reconnet(this.wsUrl)
        }
      },
      
      getSocketData(symbol) {//发送信息
        let data = {
          targetUid: 14,
          msg: this.dataForm.inputText,
          type: this.dataForm.type,
          etag: 123,
          chatType: 0
        };
        //      console.log(data)
        this.sendMsg(data, ev => {//得到回执并添加我的信息
                    console.log(ev.data)
        })
        data.fromUid=this.uid
        data.content=data.msg
        this.messages.push(data)
        this.dataForm.type=0;
        this.dataForm.inputText=""
      },
      getMoreOrder() {},
      toBottom() {
        this.$nextTick(() => {
          var defaultTop = document.body.scrollTop
          document.documentElement.scrollTop = document.body.scrollTop = document.documentElement.scrollHeight + document.body.scrollHeight
          //      alert(document.documentElement.scrollTop)
          //      document.querySelector("#record").scrollTop=document.querySelector("#record").scrollHeight
        })
      },
      fixedBottom() {
        clearTimeout(this.timer)
      },
      createSocket(url) { //创建socket
        try {
          if('WebSocket' in window) {
            this.socket = new WebSocket(url)
          } else if('MozWebSocket' in window) {
            this.socket = new MozWebSocket(url)
          }
          //Vue.prototype.socket = socket //需要主动关闭的话就可以直接调用this.socket.close()进行关闭，不需要的话这个可以去掉
          this.initSocket()
        } catch(e) {
          this.reconnet(url)
        }
      },
      sendMsg(data, callback) { //发送数据,接收数据
        if(this.socket.readyState === 1) {
          this.globalCallback = callback;
          this.sendData = data;

          data = JSON.stringify(data);
          this.socket.send(data);
        } else {
          setTimeout(() => {
            console.log(this.socket, 'Wait for socket connection to succeed')
            this.sendMsg(data, callback)
          }, 1500)
          return false
        }
        this.socket.onmessage = ev => {
          callback && callback(ev)
        }
      },
      reconnet(url) { //重新连接websock函数
        if(this.lockReconnet)
          return false

        this.isReconnet = true;
        this.lockReconnet = true
        setTimeout(() => {
          this.createSocket(url)
          this.lockReconnet = false
        }, 2000)
      },
      heartCheckReset() { //心跳充值
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
      },
      heartCheckStart() { //心跳检测开始
        this.heartCheckReset()
        let that = this;
        this.timeoutObj = setTimeout(() => {
          //发送数据，如果onmessage能接收到数据，表示连接正常,然后在onmessage里面执行reset方法清除定时器
          this.socket.send('heart check')
          this.serverTimeoutObj = setTimeout(() => {
            this.socket.close()
          }, that.timeout)
        }, this.timeout)
      }
    },
    uploadImg(base64, folderName, name) {
        this.$http({
          url: this.$http.adornUrl(`/business/common/upload`),
          method: 'post',
          data: this.$http.adornData({
            base64: base64,
            folderName: folderName
          })
        }).then(({
          data
        }) => {
          this.fullscreenLoading = false;
          if(data && data.code === 200) {
            this.dataForm[name] = data.data;
            this.dataForm.type=1;
            this.getSocketData()
          } else {
            this.$alert(data.msg, this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
            });
          }
        })
      },
// 上传图片
      add_img(event, name, width, height, index) {
        var reader = new FileReader();
        var AllowImgFileSize = 500 * 1024; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
        var file = event.target.files[0]
        var imgUrlBase64;
        if(file) {
          //将文件以Data URL形式读入页面
          imgUrlBase64 = reader.readAsDataURL(file);
          reader.onload = (e) => {
            //var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
            if(AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
              this.$alert(this.$t('上传失败，请上传不大于500k的图片!'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
              });
              return;
            }
            this.canvasDataURL(reader.result, {
              quality: 0.6,
              type: file.type,
              width,
              height
            }, (base64Codes) => {
             event.target.value = "" //清空input[file]
              this.uploadImg(base64Codes, 'instruction', 'inputText')
            })
          }
        }

      },
      canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function() {
          var that = this;
          // 默认按比例压缩
          var w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          var quality = 1; // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = w;
          var anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if(obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL(obj.type, quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },
  }
</script>

<style lang="scss">
  .chat-dialog {
    .el-dialog {
      width: 1200px;
    }
    .el-dialog__body {
      padding: 0;
      font-size: 0;
    }
    .el-dialog__headerbtn {
      top: 8px;
    }
  }
  
  //联系商家
  .chat-list {
    display: inline-block;
    vertical-align: top;
    width: 230px;
    font-size: 14px;
    ul {
      height: 576px;
      overflow: auto;
    }
    li {
      height: 64px;
      padding: 12px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #f6f6f6;
      &:hover {
        background: #f5f6f7;
      }
      &.active {
        background: #ebedf0;
      }
    }
    .img {
      width: 40px;
      height: 40px;
      margin: 0 12px;
      background: #eee;
      border-radius: 50%;
      display: inline-block;
      vertical-align: top;
    }
    .right {
      display: inline-block;
      vertical-align: top;
      color: #000;
      width: 144px;
    }
    .time,
    .content {
      color: #666;
    }
    .name-wrap {
      line-height: 20px;
    }
    .name {
      width: 80px;
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      font-size: 12px;
      display: inline-block;
      vertical-align: top;
      width: 58px;
      text-align: center;
    }
    .content {
      font-size: 13px;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      width: 100%;
    }
  }
  
  .order-info {
    font-size: 14px;
    display: inline-block;
    vertical-align: top;
    width: 970px;
    position: relative;
    height: 11rem;
    .tools {
      height: 30px;
      line-height: 30px;
      border-top: 1px solid #ddd;
      .relative {
        position: relative;
        display: inline-block;
        vertical-align: top;
      }
      .img {
        width: 20px;
        height: 20px;
        margin-top: 5px;
        cursor: pointer;
      }
      .input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
      }
    }
    .content {
      background: #fff;
      top: 0;
      left: 0;
      width: 100%;
      font-size: .28rem;
      z-index: 10;
      background: #f6f6f6;
      border-top: #ededed 1px solid;
      border-bottom: #ededed 1px solid;
      padding: 8px 0;
    }
    .img {
      width: 40px;
      height: 40px;
      margin: 0 12px;
      background: #eee;
      border-radius: 50%;
      display: inline-block;
      vertical-align: top;
    }
    .right {
      display: inline-block;
      vertical-align: top;
      color: #000;
      width: 162px;
      font-size: 14px;
      line-height: 20px;
    }
    .intro {
      font-size: 12px;
      color: #a3a4a6;
      font-size: 12px;
    }
    .record {
      height: 344px;
      overflow: auto;
    }
    li {
      padding: 0 .32rem;
      list-style: none;
    }
    .status {
      font-size: .34rem;
      text-align: center;
      line-height: .48rem;
      margin-bottom: .54rem;
    }
    .avatar {
      display: inline-block;
      vertical-align: top;
      width: .8rem;
      height: .8rem;
      line-height: .8rem;
      border-radius: 50%;
      background: #61b88e;
      text-align: center;
      color: #fff;
      position: relative;
      z-index: 1;
      &:after {
        width: .5rem;
        display: block;
        position: absolute;
        width: .08rem;
        height: .08rem;
        background: #61b88e;
        content: '';
        border: .03rem solid #fff;
        right: .04rem;
        bottom: 0.10rem;
        border-radius: 50%;
      }
    }
    .detail {
      word-break: break-all;
      display: inline-block;
      max-width: 4.92rem;
      vertical-align: top;
      background: #eee;
      border-radius: .32rem;
      margin-left: .2rem;
      line-height: .54rem;
      padding: .16rem .3rem;
      margin-bottom: .8rem;
    }
    .detail.blue{background: #2683f5;color: #fff;}
    .ke {}
    .time {
      text-align: center;
      margin-bottom: .12rem;
      font-size: .18rem;
    }
    .mine {
      text-align: right;
      .avatar {
        margin-left: .2rem;
        background: #fc9b00;
        &:after {
          background: #fc9b00;
        }
      }
      .detail {
        text-align: left;
      }
    }
  }
  
  .send-box {
    width: 100%;
    background: #fff;
    height: 80px;
    z-index: 999;
    position: relative;
    .input {
      display: block;
      width: 100%;
      padding: 5px 0 0;
      height: 104px;
      line-height: 16px;
      outline: none;
      border: none;
      padding-right: 1.72rem;
      padding-left: .5rem;
      appearance: none;
    }
    .send-wrap {
      text-align: right;
      padding-right: 30px;
      line-height: 30px;
    }
    .send {
      border: 1px solid #ccc;
      border-radius: .3rem;
      text-align: center;
      line-height: .6rem;
      font-size: .34rem;
      display: inline-block;
      vertical-align: top;
      padding: 4px 15px;
      cursor: pointer;
      margin-left: 5px;
    }
  }
  
  .merchant-dialog {
    .el-dialog__body {
      padding: 0;
      height: 100%;
    }
    .order-info {
      height: 100%;
    }
  }
  
  .el-card {
    padding: 10px;
  }
  
  .my-dialog {
    .el-dialog__body {
      background-color: rgb(240, 240, 240);
      padding: 0;
    }
    .number {
      float: none;
    }
  }
  
  .order-info .more {
    text-align: center;
    margin-bottom: .4rem;
    color: #638bd4;
    margin-top: -.2rem;
  }
  
  .withdraw-coin-box {
    .el-dialog {
      width: 750px;
    }
    .el-input {
      width: 420px;
    }
    .el-input--medium .el-input__inner {
      width: 420px;
    }
    .has-coin {
      text-align: right;
      font-size: 12px;
      width: 420px;
      margin-left: 100px;
      margin-top: -22px
    }
    .btn {
      padding: 10px;
      width: 112px;
    }
    .btn1 {
      padding: 10px 0;
      width: 80px;
    }
  }
</style>