// pages/countdown/countdown.js
Page({
  data: {
    task: null,
    displayValue: '',
    isCounting: false,
    timerId: null,
    audioContext: null,
  },

  onLoad(options) {
    if (!options.id) {
      this.handleError('无效的任务ID');
      return;
    }

    const tasks = wx.getStorageSync('tasks') || [];
    const task = tasks.find(t => t.id == options.id);

    if (!task) {
      this.handleError('找不到任务');
      return;
    }
    
    this.setData({ task }, () => {
      wx.setNavigationBarTitle({ title: this.data.task.name });
      this.initializeTask();
    });
  },

  initializeTask() {
    const task = this.data.task;
    const audioContext = wx.createInnerAudioContext();
    this.setData({ audioContext });

    if (task.type === 'countdown') {
      this.setData({ displayValue: task.value });
      this.runSpokenCountdown();
    } else if (task.type === 'timer') {
      this.setData({ displayValue: this.formatTime(task.remainingSeconds) });
      if (task.remainingSeconds > 0) {
        this.runTimer();
      } else {
        this.setData({ displayValue: '完成!' });
      }
    }
  },

  runSpokenCountdown() {
    let currentValue = this.data.task.value;
    
    const playNextSound = () => {
      if (currentValue > 0) {
        this.setData({ displayValue: currentValue });
        this.data.audioContext.src = `/audio_pkg/audios/${currentValue}.mp3`;
        this.data.audioContext.play();
        currentValue--;
      } else {
        this.finishTask('完成!');
      }
    };

    this.data.audioContext.onEnded(playNextSound);
    this.data.audioContext.onError(() => setTimeout(playNextSound, 1000));
    playNextSound();
  },

  runTimer() {
    this.setData({ isCounting: true });
    this.data.audioContext.src = '/audio_pkg/audios/di.mp3';

    const timerId = setInterval(() => {
      let newRemainingSeconds = this.data.task.remainingSeconds - 1;
      
      this.setData({
        'task.remainingSeconds': newRemainingSeconds,
        displayValue: this.formatTime(newRemainingSeconds)
      });
      
      if (newRemainingSeconds > 0) {
        this.playTickSound();
      } else {
        this.finishTask('完成!');
      }
    }, 1000);
    this.setData({ timerId });
  },

  finishTask(message) {
    this.stopAll();
    this.setData({ displayValue: message });
    this.playCompletionSound();
    setTimeout(() => wx.navigateBack(), 2000);
  },
  
  stopAll() {
    if (this.data.timerId) {
      clearInterval(this.data.timerId);
      this.setData({ timerId: null, isCounting: false });
    }
    if (this.data.audioContext) {
      this.data.audioContext.stop();
      this.data.audioContext.offEnded();
      this.data.audioContext.offError();
    }
  },

  updateStorage() {
    if (!this.data.task) return;
    const tasks = wx.getStorageSync('tasks') || [];
    const taskIndex = tasks.findIndex(t => t.id == this.data.task.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = this.data.task;
      wx.setStorageSync('tasks', tasks);
    }
  },

  formatTime: (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  },

  playTickSound() {
    if (this.data.audioContext) {
      this.data.audioContext.seek(0);
      this.data.audioContext.play();
    }
  },

  playCompletionSound() {
    if (this.data.audioContext) this.data.audioContext.stop();
    const completionAudio = wx.createInnerAudioContext();
    completionAudio.src = '/audio_pkg/audios/完成.mp3';
    completionAudio.play();
  },

  handleError(message) {
    wx.showToast({ title: message, icon: 'none' });
    wx.navigateBack();
  },

  onUnload() {
    if (this.data.task && this.data.task.type === 'timer' && this.data.isCounting) {
      this.updateStorage();
    }
    this.stopAll();
    if (this.data.audioContext) {
      this.data.audioContext.destroy();
    }
  },
});
