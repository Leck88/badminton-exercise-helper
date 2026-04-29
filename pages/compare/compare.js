const app = getApp()

Page({
  data: {
    selectedRackets: [],
    hotRackets: [],
    allRackets: [],
    filterRackets: [],
    brands: [],
    filterBrand: '',
    filterLevel: '',
    summary: []
  },

  onLoad() {
    const allRackets = app.globalData.rackets
    const brands = [...new Set(allRackets.map(r => r.brand))]
    
    this.setData({
      allRackets,
      hotRackets: allRackets.filter(r => r.isHot).slice(0, 8),
      brands,
      filterRackets: allRackets
    })
    
    // 默认选中前两款热门球拍
    const defaultRackets = allRackets.slice(0, 2)
    this.setData({ selectedRackets: defaultRackets })
    this.updateSummary()
  },

  // 筛选品牌
  setFilterBrand(e) {
    const brand = e.currentTarget.dataset.brand
    this.setData({ filterBrand: brand })
    this.applyFilter()
  },

  // 筛选级别
  setFilterLevel(e) {
    const level = e.currentTarget.dataset.level
    this.setData({ filterLevel: level })
    this.applyFilter()
  },

  // 应用筛选
  applyFilter() {
    const { allRackets, filterBrand, filterLevel } = this.data
    let filtered = [...allRackets]
    
    if (filterBrand) {
      filtered = filtered.filter(r => r.brand === filterBrand)
    }
    
    if (filterLevel) {
      filtered = filtered.filter(r => r.level === filterLevel)
    }
    
    // 标记已选中的
    const selectedIds = this.data.selectedRackets.map(r => r.id)
    filtered = filtered.map(r => ({
      ...r,
      isSelected: selectedIds.includes(r.id)
    }))
    
    this.setData({ filterRackets: filtered })
  },

  showPicker() {
    const { filterRackets, selectedIds } = this
    const availableRackets = filterRackets.filter(r => !selectedIds.includes(r.id))
    
    if (availableRackets.length === 0) {
      wx.showToast({ title: '没有更多可添加的球拍', icon: 'none' })
      return
    }
    
    wx.showActionSheet({
      itemList: availableRackets.slice(0, 10).map(r => `${r.brand} ${r.name}`),
      success: (res) => {
        const racket = availableRackets[res.tapIndex]
        if (racket && this.data.selectedRackets.length < 4) {
          this.addRacket(racket)
        }
      }
    })
  },

  addRacket(racket) {
    if (this.data.selectedRackets.length >= 4) {
      wx.showToast({ title: '最多选择4款', icon: 'none' })
      return
    }
    
    if (this.data.selectedRackets.find(r => r.id === racket.id)) {
      return
    }
    
    this.setData({
      selectedRackets: [...this.data.selectedRackets, racket]
    })
    this.applyFilter()
    this.updateSummary()
  },

  removeRacket(e) {
    const id = e.currentTarget.dataset.id
    const newSelected = this.data.selectedRackets.filter(r => r.id !== id)
    this.setData({ selectedRackets: newSelected })
    this.applyFilter()
    this.updateSummary()
  },

  quickAdd(e) {
    const id = e.currentTarget.dataset.id
    const racket = this.data.allRackets.find(r => r.id === id)
    if (racket) {
      if (this.data.selectedRackets.find(r => r.id === id)) {
        // 已选中则移除
        this.removeRacket({ currentTarget: { dataset: { id } } })
      } else {
        this.addRacket(racket)
      }
    }
  },

  updateSummary() {
    const rackets = this.data.selectedRackets
    if (rackets.length < 2) {
      this.setData({ summary: [] })
      return
    }

    // 计算各项最高
    const getMax = (key) => {
      let max = { value: 0, name: '' }
      rackets.forEach(r => {
        if (r.performance[key] > max.value) {
          max = { value: r.performance[key], name: r.name }
        }
      })
      return max
    }

    // 找性价比最高
    const getBestValue = () => {
      let best = { ratio: 0, name: '' }
      rackets.forEach(r => {
        const avgPerf = (r.performance['杀球威力'] + r.performance['控球性'] + r.performance['挥速']) / 3
        const ratio = avgPerf / r.price * 100
        if (ratio > best.ratio) {
          best = { ratio, name: r.name }
        }
      })
      return best
    }

    const bestValue = getBestValue()

    this.setData({
      summary: [
        { icon: '⚔️', label: '杀球最强', ...getMax('杀球威力') },
        { icon: '🎯', label: '控球最强', ...getMax('控球性') },
        { icon: '💨', label: '速度最快', value: getMax('挥速').value, name: getMax('挥速').name },
        { icon: '🛡️', label: '防守最强', ...getMax('防守') },
        { icon: '💰', label: '性价比最高', value: '推荐', name: bestValue.name }
      ]
    })
  }
})
