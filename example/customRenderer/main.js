// Vue3 134  现在来到了我们的组件处理的功能实现 先创建我们的runtime-core文件夹
// example文件夹  index.html main.js App.js 
import {createRenderer} from '../../lib/guide-mini-vue.esm.js'
import {App} from './App.js'
console.log(PIXI)

const game = new PIXI.Application({
    width:500,
    height:500
})

document.body.append(game.view)

const renderer = createRenderer({
    createElement(type){
        if(type === 'rect'){
            const rect = new PIXI.Graphics()
                rect.beginFill(0xff0000)
                rect.drawRect(0,0,100,100)
                rect.endFill()

                return rect
        }
    },

    patchProp(el,key,val){
        el[key] = val
    },

    insert(el,parent){
        parent.addChild(el)
    }
})

renderer.createApp(App).mount(game.stage)

// const rootContainer = document.querySelector('#app')
// createApp(App).mount(rootContainer)