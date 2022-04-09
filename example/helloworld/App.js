import {h} from '../../lib/guide-mini-vue.esm.js'
window.self = null
export const App = {
    // .vue
    // 我们还未实现template的编译功能 我们先去实现我们的render函数
    render(){
        window.self = this

        return h('div',{ 
            id:"root",
            class:["red","hard"]
        },
        // setupState
        // $el
        // [h("p",{class:"red"},"hi"),
            // h("p",{class:'blue'},"mini-vue")]
        'hi ' + this.msg)
    },
    setup(){
        // compsition api
        return {
            msg:'mini-vue'
        }
    }
}