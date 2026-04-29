const app = getApp()

Page({
  data: {
    currentTab: 'racket',
    // 筛选状态
    currentBrand: '',
    currentLevel: '',
    currentSort: 'rating',
    // 筛选选项
    brands: [],
    levels: ['入门级', '进阶级', '专业级'],
    sortOptions: [
      { value: 'rating', label: '综合评分' },
      { value: 'price-asc', label: '价格从低到高' },
      { value: 'price-desc', label: '价格从高到低' },
      { value: 'sales', label: '销量最高' }
    ],
    // 数据
    rackets: [],
    grips: [],
    shuttlecocks: [],
    shoes: [],
    // 筛选后的数据
    filteredRackets: [],
    filteredGrips: [],
    filteredShuttlecocks: [],
    filteredShoes: [],
    techKeys: [],
    // 弹窗状态
    showBrandPicker: false,
    showLevelPicker: false,
    showSortPicker: false
  },

  onLoad(options) {
    const type = options.type
    if (type) {
      this.setData({ currentTab: type })
    }
    this.loadData()
  },

  loadData() {
    const globalData = app.globalData
    const rackets = globalData.rackets
    const grips = globalData.grips
    const shuttlecocks = globalData.shuttlecocks
    const shoes = globalData.shoes

    // 提取品牌列表
    const racketBrands = [...new Set(rackets.map(r => r.brand))]
    const gripBrands = [...new Set(grips.map(g => g.brand))]
    const shuttlecockBrands = [...new Set(shuttlecocks.map(s => s.brand))]
    const shoeBrands = [...new Set(shoes.map(s => s.brand))]

    this.setData({
      rackets,
      grips,
      shuttlecocks,
      shoes,
      racketBrands,
      gripBrands,
      shuttlecockBrands,
      shoeBrands,
      techKeys: shoes.length > 0 ? Object.keys(shoes[0].technology) : []
    })

    this.applyFilters()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
      currentBrand: '',
      currentLevel: ''
    })
    this.applyFilters()
  },

  // 获取当前tab对应的品牌列表
  getCurrentBrands() {
    const { currentTab, racketBrands, gripBrands, shuttlecockBrands, shoeBrands } = this.data
    switch (currentTab) {
      case 'racket': return racketBrands || []
      case 'grip': return gripBrands || []
      case 'shuttlecock': return shuttlecockBrands || []
      case 'shoe': return shoeBrands || []
      default: return []
    }
  },

  // 获取当前tab对应的筛选数据
  getCurrentData() {
    const { currentTab, rackets, grips, shuttlecocks, shoes } = this.data
    switch (currentTab) {
      case 'racket': return rackets
      case 'grip': return grips
      case 'shuttlecock': return shuttlecocks
      case 'shoe': return shoes
      default: return []
    }
  },

  setCurrentFilteredData(data) {
    const { currentTab } = this.data
    switch (currentTab) {
      case 'racket': this.setData({ filteredRackets: data }); break
      case 'grip': this.setData({ filteredGrips: data }); break
      case 'shuttlecock': this.setData({ filteredShuttlecocks: data }); break
      case 'shoe': this.setData({ filteredShoes: data }); break
    }
  },

  // 应用筛选
  applyFilters() {
    let data = this.getCurrentData()
    const { currentBrand, currentLevel, currentSort } = this.data

    // 品牌筛选
    if (currentBrand) {
      data = data.filter(item => item.brand === currentBrand)
    }

    // 级别筛选
    if (currentLevel) {
      data = data.filter(item => item.level === currentLevel)
    }

    // 排序
    switch (currentSort) {
      case 'rating':
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price-asc':
        data.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        data.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'sales':
        data.sort((a, b) => (b.sales || 0) - (a.sales || 0))
        break
    }

    this.setCurrentFilteredData(data)
  },

  // 品牌筛选
  toggleBrandPicker() {
    this.setData({ showBrandPicker: !this.data.showBrandPicker })
  },

  selectBrand(e) {
    // picker模式下通过detail.value获取索引
    const index = e.detail.value
    const brands = this.getCurrentBrands()
    const brand = brands[index] || ''
    this.setData({ currentBrand: brand })
    this.applyFilters()
  },

  // 级别筛选
  toggleLevelPicker() {
    this.setData({ showLevelPicker: !this.data.showLevelPicker })
  },

  selectLevel(e) {
    const level = e.currentTarget.dataset.level
    this.setData({
      currentLevel: level === this.data.currentLevel ? '' : level
    })
    this.applyFilters()
  },

  // 排序
  toggleSortPicker() {
    this.setData({ showSortPicker: !this.data.showSortPicker })
  },

  selectSort(e) {
    const sort = e.currentTarget.dataset.sort
    this.setData({
      currentSort: sort,
      showSortPicker: false
    })
    this.applyFilters()
  },

  // 清空筛选
  clearFilters() {
    this.setData({
      currentBrand: '',
      currentLevel: '',
      currentSort: 'rating'
    })
    this.applyFilters()
  },

  // 获取当前选中的数据
  getDisplayData() {
    const { currentTab, filteredRackets, filteredGrips, filteredShuttlecocks, filteredShoes } = this.data
    switch (currentTab) {
      case 'racket': return filteredRackets
      case 'grip': return filteredGrips
      case 'shuttlecock': return filteredShuttlecocks
      case 'shoe': return filteredShoes
      default: return []
    }
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
  }
})
