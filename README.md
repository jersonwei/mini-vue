# mini-vue        内容参考仓库 https://github.com/cuixiaorui/mini-vue
## 基于TDD单侧驱动逻辑 大体实现了以下流程
## reactivity模块
   * effect&reactive&依赖收集&触发依赖
   * effect的runner&scheduler
   * effect的stop
   * readonly系列
   * isProxy
   * ref系列
   * computed
* rollup打包
## runtime-core
   * 初始化element
   * shapeFlags
   * 注册事件功能
   * 组件props
   * 组件emit
   * 组件slots
   * provide-inject
   * 自定义渲染器custom renderer      [上一模块](#mini-vue)
## runtime-dom
   * 更新element的流程搭建
   * 更新element的props
   * 更新element的children
   * 更新element的children双端对比diff算法1
   * 更新element的children双端对比diff算法2
   * 更新element的children双端对比diff算法3   [上一模块](#reactivity模块)
## 编译模块
   * nextTick
   * 编译模板概述
   * 解析插值功能
   * 解析element
   * 解析text功能
   * 解析三种联合类型
   * parse的实现原理&有限状态机  [上一模块](#runtime-core)
## 代码编译----------------------
## template编译------------------
[回到顶部](#mini-vue)

vue3 core-code重点
总结笔记 https://juejin.cn/column/7089050969648365581 <br />

