// pages/index/index.js
const DELETE_BTN_WIDTH = 90; // px

Page({
  data: {
    tasks: [],
    lastOpenedId: null,
  },
  touchStartX: 0,

  onShow() {
    this.loadTasks();
  },

  loadTasks() {
    const tasks = wx.getStorageSync('tasks') || [];
    tasks.forEach(task => {
      task.x = 0;
      task.confirmingDelete = false;
    });
    this.setData({ tasks, lastOpenedId: null });
  },

  // --- Event Handlers ---

  deleteTask(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          // User confirmed, proceed with deletion.
          let tasks = this.data.tasks.filter(t => t.id !== id);
          this.setData({ tasks: tasks, lastOpenedId: null });
          wx.setStorageSync('tasks', tasks);
        } else if (res.cancel) {
          // User cancelled, close the delete button.
          this.closeDelete(id);
        }
      }
    });
  },

  onTouchEnd(e) {
    const id = e.currentTarget.dataset.id;
    const endX = e.changedTouches[0].pageX;
    const startX = this.touchStartX;
    const deltaX = startX - endX;
    
    // Close any other open item.
    if (this.data.lastOpenedId && this.data.lastOpenedId !== id) {
      this.closeDelete(this.data.lastOpenedId);
    }

    // Decide whether to open or close the current item based on swipe distance.
    if (deltaX > DELETE_BTN_WIDTH / 2) {
      this.openDelete(id);
    } else {
      this.closeDelete(id);
    }
  },

  onTouchStart(e) {
    this.touchStartX = e.changedTouches[0].pageX;
  },

  goToDynamicTask(e) {
    const id = e.currentTarget.dataset.id;
    const task = this.data.tasks.find(t => t.id === id);

    if (task && task.x !== 0) {
      this.closeDelete(id);
      return;
    }
    
    this.resetAllDeletes();
    wx.navigateTo({ url: `/pages/countdown/countdown?id=${id}` });
  },

  // --- Helper & Navigation Functions ---

  openDelete(id) {
    let tasks = this.data.tasks;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index].x = -DELETE_BTN_WIDTH;
      this.setData({ tasks: tasks, lastOpenedId: id });
    }
  },

  closeDelete(id) {
    let tasks = this.data.tasks;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index].x = 0;
      tasks[index].confirmingDelete = false;
      this.setData({ tasks: tasks });
    }
  },

  resetAllDeletes() {
    if (this.data.lastOpenedId) {
      this.closeDelete(this.data.lastOpenedId);
      this.setData({ lastOpenedId: null });
    }
  },

  goToCreateTask() {
    this.resetAllDeletes();
    wx.navigateTo({ url: '/pages/task-creation/task-creation' });
  },
});
