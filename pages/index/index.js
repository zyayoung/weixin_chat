Page({
  data: {
    placeholderText: "连接服务器中...",
    scrollTop: 0,
    messageArray: [],
    socketOpen: false,
    inputValue: "",
  },
  onLoad: function(options) {
    var self = this;
    console.log("将要连接服务器。");
    wx.connectSocket({
      url: 'ws://118.25.94.244:15449',
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1'],
      method: 'GET'
    });

    wx.onSocketOpen(function(res) {
      console.log("连接服务器成功。");
      self.setData({
        placeholderText: "连接服务器成功，请输入姓名。",
        socketOpen: true
      });
    });

    wx.onSocketMessage(function(res) {
      console.log('收到服务器内容：' + res.data);
      setTimeout(function() {
        self.bottom()
      }, 100);
      var data = res.data;
      var dataArray = data.split("_");
      var newMessage = {
        type: dataArray[0],
        name: dataArray[1],
        time: dataArray[2],
        message: dataArray[3]
      };
      var newArray = self.data.messageArray.concat(newMessage);
      self.setData({
        messageArray: newArray,
        placeholderText: "请输入信息"
      });
    });
  },

  onUnload: function() {
    wx.closeSocket();
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  send: function() {
    if (this.data.inputValue != "") {
      this.sendSocketMessage(this.data.inputValue);
      this.setData({
        inputValue: ""
      });
    }
  },

  bottom: function() {
    var query = wx.createSelectorQuery()
    query.select('#hei').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      wx.pageScrollTo({
        scrollTop: res[0].bottom // #the-id节点的下边界坐标
      })
      res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },

  sendSocketMessage: function(msg) {
    if (this.data.socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    }
  }
});