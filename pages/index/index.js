const app = getApp()

Page({
  data: {
    hotRackets: [],
    rackets: [],
    grips: [],
    shuttlecocks: [],
    shoes: [],
    techKeys: ['动力垫', '能量回弹', '减震'],
    gripTypes: [
      { name: '薄手胶', sweat: '★★☆', grip: '★★★★', feel: '★★★★★', durable: '★★★', typeClass: 'thin' },
      { name: '粘性胶', sweat: '★★★', grip: '★★★★☆', feel: '★★★★', durable: '★★★★', typeClass: 'sticky' },
      { name: '毛巾胶', sweat: '★★★★★', grip: '★★★★☆', feel: '★★★', durable: '★★', typeClass: 'towel' },
      { name: '复合胶', sweat: '★★★★', grip: '★★★★', feel: '★★★★☆', durable: '★★★', typeClass: 'combo' }
    ]
  },

  onLoad() {
    this.loadData()
  },

  loadData() {
    const globalData = app.globalData
    // 按评分排序取前4款热门球拍
    const sortedRackets = [...globalData.rackets].sort((a, b) => b.rating - a.rating)
    
    this.setData({
      hotRackets: sortedRackets.slice(0, 3),
      rackets: globalData.rackets,
      grips: globalData.grips,
      shuttlecocks: globalData.shuttlecocks,
      shoes: globalData.shoes
    })
  },

  goToCategory(e) {
    const type = e.currentTarget.dataset.type
    wx.switchTab({
      url: '/pages/category/category?type=' + type
    })
  },

  goRacketDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/racket-detail/racket-detail?id=' + id
    })
  },

  goGripDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/grip-detail/grip-detail?id=' + id
    })
  },

  goCompare() {
    wx.navigateTo({
      url: '/pages/compare/compare'
    })
  }
})
