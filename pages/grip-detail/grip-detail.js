const app = getApp()

Page({
  data: {
    grip: null,
    ratingInt: 0
  },

  onLoad(options) {
    const id = options.id
    const grip = app.globalData.grips.find(g => g.id === id)
    if (grip) {
      this.setData({
        grip,
        ratingInt: Math.floor(grip.rating)
      })
      wx.setNavigationBarTitle({
        title: grip.brand + ' ' + grip.name
      })
    }
  }
})
