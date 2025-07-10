// pages/index/index.js
// const plugin = requirePlugin("WechatSI");

const numbers = Array.from({ length: 120 }, (_, i) => i + 1);

Page({
  data: {
    numbers: numbers,
    selectedNumber: 30, // 默认选中的数字
    value: [29], // 默认索引 (30-1)
    currentNumber: 0, // 当前倒计时数字
    isCounting: false, // 是否正在倒计时
    timer: null,       // 计时器实例
  },

  // 当滚动选择时触发
  bindChange(e) {
    const val = e.detail.value;
    this.setData({
      selectedNumber: this.data.numbers[val[0]],
      value: val,
    });
  },

  // 点击“开始倒计时”按钮
  startCountdown() {
    if (this.data.selectedNumber <= 0) {
      wx.showToast({
        title: '请选择一个大于0的数字',
        icon: 'none',
      });
      return;
    }

    this.setData({
      isCounting: true,
      currentNumber: this.data.selectedNumber,
    });

    this.speak(this.data.currentNumber);
    this.runTimer();
  },

  // 运行计时器
  runTimer() {
    this.data.timer = setInterval(() => {
      const newNumber = this.data.currentNumber - 1;

      if (newNumber > 0) {
        this.setData({
          currentNumber: newNumber,
        });
        this.speak(newNumber);
      } else {
        // 倒计时结束
        this.setData({
          currentNumber: '完成!',
        });
        this.speak('完成');
        this.stopTimer();
        // 2秒后重置回初始界面
        setTimeout(() => {
          this.setData({ isCounting: false });
        }, 2000);
      }
    }, 1500); // 1.5秒的间隔，符合1-2秒的要求
  },

  // 停止计时器
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 使用本地音频文件进行语音播报
  speak(text) {
    const audioPath = `/audio_pkg/audios/${text}.mp3`;
    const innerAudioContext = wx.createInnerAudioContext();
    
    innerAudioContext.src = audioPath;
    innerAudioContext.play();

    innerAudioContext.onPlay(() => {
      console.log(`开始播放: ${audioPath}`);
    });

    innerAudioContext.onError((res) => {
      console.error(`播放失败: ${audioPath}`, res.errMsg);
      // 可以在这里添加一个静默失败的提示，或者不提示
      // wx.showToast({
      //   title: '音频播放失败',
      //   icon: 'none',
      // });
    });
  },

  // 页面卸载时清理计时器，防止内存泄漏
  onUnload() {
    this.stopTimer();
  },
});
