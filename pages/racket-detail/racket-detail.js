const app = getApp()

Page({
  data: {
    racket: null,
    ratingInt: 0
  },

  onLoad(options) {
    const id = options.id
    const racket = app.globalData.rackets.find(r => r.id === id)
    if (racket) {
      this.setData({
        racket,
        ratingInt: Math.floor(racket.rating)
      })
      wx.setNavigationBarTitle({
        title: racket.name
      })
    }
  },

  goToCompare() {
    wx.navigateTo({
      url: '/pages/compare/compare'
    })
  }
})
