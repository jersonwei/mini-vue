// Vue3 134  现在来到了我们的组件处理的功能实现 先创建我们的runtime-core文件夹
// example文件夹  index.html main.js App.js 
// import {createRenderer} from '../../lib/guide-mini-vue.esm.js'
// import {App} from './App.js'
console.log(PIXI)
const renderer = createRenderer({
    createElement(type){},

    patchProp(el,key,val){

    },

    insert(el,parent){

    }
})

// const rootContainer = document.querySelector('#app')
// createApp(App).mount(rootContainer)