//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    level: 1,
    animation: '',
    cutAnimation: '',
    state: 'ready', // ready run success fail
    width: 375, 
    height: 450,
    lineHeight: 0,
    scX: 0,
    scY: 0, 
    scWidth: 30,
    cutAnimationLength: 0,
    direction: 'to',
    step: 3, 
    stepRange: 1,
    canvas: '',
    ctx: '',
    showModal: false,
    btn: '开始',
    tip: '',
    maskbtn: '',
    score: 0
  },
  onLoad: function () {
    this.initParams();
    this.renderCanvas();
  },
  initParams: function () {
    let self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.data.width = res.windowWidth;
        // self.data.height = res.windowHeight;
      }
    })

    wx.getStorage({
      key: 'score',
      success: function(res) {
        res.data && self.setData({score: +res.data})
      }
    })

    this.data.lineHeight = this.data.height * (3 / 5);
    this.data.scY = this.data.height / 2;

    this.data.ctx = wx.createCanvasContext('rope_canvas')
  },
  renderCanvas: function () {
    this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);

    this.data.ctx.setLineWidth(2);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.width / 2, 10);
    this.data.ctx.lineTo(this.data.width / 2, this.data.lineHeight);
    this.data.ctx.stroke();

    this.data.ctx.beginPath();
    this.data.ctx.arc(this.data.width / 2, this.data.lineHeight, 20, 0, 2 * Math.PI, true);
    this.data.ctx.setFillStyle('black')
    this.data.ctx.fill();
    this.data.ctx.stroke();

    this.data.ctx.setLineWidth(4);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.scX, this.data.scY);
    this.data.ctx.lineTo(this.data.scX + this.data.scWidth, this.data.scY);
    this.data.ctx.stroke();

    this.data.ctx.draw();
  },
  draw: function () {
    if (this.data.scX <= 0) {
      this.data.direction = 'to'
    } else if (this.data.scX >= this.data.width - this.data.scWidth) {
      this.data.direction = 'back'
    }

    if (this.data.direction === 'to') {
      this.data.scX += this.data.step;
    } else if (this.data.direction === 'back') {
      this.data.scX -= this.data.step;
    }

    this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);

    this.data.ctx.setLineWidth(2);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.width / 2, 10);
    this.data.ctx.lineTo(this.data.width / 2, this.data.lineHeight);
    this.data.ctx.stroke();

    this.data.ctx.beginPath();
    this.data.ctx.arc(this.data.width / 2, this.data.lineHeight, 20, 0, 2 * Math.PI, true);
    this.data.ctx.setFillStyle('black')
    this.data.ctx.fill();
    this.data.ctx.stroke();

    this.data.ctx.setLineWidth(4);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.scX, this.data.scY);
    this.data.ctx.lineTo(this.data.scX + this.data.scWidth, this.data.scY);
    this.data.ctx.stroke();

    this.data.ctx.draw();

    this.data.animation = setTimeout(this.draw, 16);
  },
  cut: function () {
    if (this.data.cutAnimationLength + this.data.scY >= this.data.height) return;

    this.data.cutAnimationLength += 2;

    this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);

    this.data.ctx.setLineWidth(4);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.scX, this.data.scY);
    this.data.ctx.lineTo(this.data.scX + this.data.scWidth, this.data.scY);
    this.data.ctx.stroke();

    this.data.ctx.setLineWidth(2);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.width / 2, 10);
    this.data.ctx.lineTo(this.data.width / 2, this.data.scY);
    this.data.ctx.stroke();

    this.data.ctx.setLineWidth(2);
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(this.data.width / 2, this.data.cutAnimationLength + this.data.scY);
    this.data.ctx.lineTo(this.data.width / 2, this.data.lineHeight + this.data.cutAnimationLength);
    this.data.ctx.stroke();

    this.data.ctx.beginPath();
    this.data.ctx.arc(this.data.width / 2, this.data.lineHeight + this.data.cutAnimationLength, 20, 0, 2 * Math.PI, true);
    this.data.ctx.setFillStyle('black')
    this.data.ctx.fill();
    this.data.ctx.stroke();

    this.data.ctx.draw();

    this.data.cutAnimationLength + this.data.scY <= this.data.height && (this.data.cutAnimation = setTimeout(this.cut, 16));
  },
  stop: function () {
    if (!this.data.animation || this.data.state !== 'run') return;

    clearTimeout(this.data.animation)

    if ((this.data.width / 2) > this.data.scX && (this.data.width / 2) < this.data.scX + this.data.scWidth) {
        this.cut();
        this.setData({
          state: 'success',
          tip: '恭喜过关!',
          maskbtn: '下一关',
          showModal: true
        })
    } else {
        var tip;
        console.log(this.data.score)
        console.log(this.data.level)
        if (this.data.level > this.data.score) {
          tip = '新纪录！共完成' + (this.data.level - 1) + '关';
          wx.setStorage({
            key: "score",
            data: this.data.level
          })
        } else {
          tip = '失败了，共完成' + (this.data.level - 1) + '关';          
        }
        this.setData({
          state: 'fail',
          tip: tip,
          maskbtn: '重来',
          showModal: true
        })
    }
  },
  restart: function () {
    var self = this;
    wx.getStorage({
      key: 'score',
      success: function(res) {
        console.log(res)
        res.data && self.setData({score: +res.data})
      }
    })

    this.setData({
      level: 1,
      state: 'ready',
      scX: 0,
      direction: 'to',
      step: 3,
      scWidth: 30,
      cutAnimationLength: 0,
      btn: '开始'
    })
    
    clearTimeout(this.data.cutAnimation)
    this.renderCanvas();
  },
  nextLevel: function () {
    this.setData({
      level: ++this.data.level,
      state: 'run',
      scX: 0,
      direction: 'to',
      cutAnimationLength: 0,
      btn: '剪断'
    })
  
    this.data.stepRange > 0.4 && (this.data.stepRange -= 0.2);

    if (this.data.step < 8) {
      this.data.step += this.data.stepRange;
    } else {
      this.data.scWidth -= 2;
    }
    clearTimeout(this.data.cutAnimation)
    this.draw();
  },
  evt_play: function (event) {
    if (this.data.state == 'ready') {
      this.setData({
        state: 'run',
        btn: '剪断'
      })
      this.draw();
    } else if (this.data.state == 'run') {
      this.stop();
    }
  },
  evt_maskplay: function (event) {
    if (this.data.state == 'success') {
      this.nextLevel();
    } else if (this.data.state == 'fail') {
      this.restart();
    }
    this.setData({
      showModal: false
    })
  }
})
