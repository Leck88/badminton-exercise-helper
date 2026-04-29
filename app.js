// app.js - 羽毛球运动功能助手
// 数据已拆分到 data/ 目录（rackets.js / grips.js / shuttlecocks.js / shoes.js）
// 维护时请编辑对应的 data/ 文件

const rackets = require('./data/rackets.js')
const grips = require('./data/grips.js')
const shuttlecocks = require('./data/shuttlecocks.js')
const shoes = require('./data/shoes.js')

App({
  globalData: {
    userInfo: null,
    rackets,
    grips,
    shuttlecocks,
    shoes,
  }
})
