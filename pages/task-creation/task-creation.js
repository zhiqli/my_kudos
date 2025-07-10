// pages/task-creation/task-creation.js
Page({
  data: {
    taskName: '',
    taskType: 'countdown', // 'countdown' (念数) or 'timer' (计时器)
    
    countdownValues: Array.from({ length: 1000 }, (_, i) => i + 1),
    minutes: Array.from({ length: 60 }, (_, i) => i),
    seconds: Array.from({ length: 60 }, (_, i) => i),

    selectedValue: 30,
    selectedMinutes: 1,
    selectedSeconds: 0,

    countdownPickerValue: [29], // 30-1
    timerPickerValue: [1, 0],

    colorPalette: [
      '#B2EBF2', '#FFCCBC', '#D7CCC8', '#F0F4C3', '#CFD8DC',
      '#C8E6C9', '#FFCDD2', '#E1BEE7', '#D1C4E9', '#BBDEFB'
    ]
  },

  onNameInput: function(e) { this.setData({ taskName: e.detail.value }); },
  onTaskTypeChange: function(e) { this.setData({ taskType: e.currentTarget.dataset.type }); },
  bindCountdownChange: function(e) { this.setData({ selectedValue: this.data.countdownValues[e.detail.value[0]] }); },
  bindTimerChange: function(e) {
    const [minuteIndex, secondIndex] = e.detail.value;
    this.setData({
      selectedMinutes: this.data.minutes[minuteIndex],
      selectedSeconds: this.data.seconds[secondIndex]
    });
  },

  getRandomColor: function() {
    const palette = this.data.colorPalette;
    return palette[Math.floor(Math.random() * palette.length)];
  },

  createTask: function() {
    if (!this.data.taskName.trim()) {
      wx.showToast({ title: '任务名称不能为空', icon: 'none' });
      return;
    }

    const totalSeconds = this.data.selectedMinutes * 60 + this.data.selectedSeconds;
    if (this.data.taskType === 'timer' && totalSeconds === 0) {
      wx.showToast({ title: '倒计时不能为0', icon: 'none' });
      return;
    }

    const newTask = {
      id: Date.now(),
      name: this.data.taskName.trim(),
      type: this.data.taskType,
      color: this.getRandomColor(),
    };

    if (this.data.taskType === 'countdown') {
      newTask.value = this.data.selectedValue;
    } else { // timer
      newTask.totalSeconds = totalSeconds;
      newTask.remainingSeconds = totalSeconds; // 关键：确保初始剩余秒数被正确设置
    }

    const tasks = wx.getStorageSync('tasks') || [];
    tasks.push(newTask);
    wx.setStorageSync('tasks', tasks);

    wx.showToast({ title: '创建成功', icon: 'success', duration: 1500 });
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
