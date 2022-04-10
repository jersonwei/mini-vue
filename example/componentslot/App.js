import {h} from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './foo.js'
export const App = {
    name:"App",
    render(){
        const app = h('div',{},"App")
        // 接受两个数据形式 数组和单个
        // 把数组的形式换成对象的key模式
        // const foo = h(Foo,{},[h("p",{},"123"),h('p',{},'234')])
        const foo = h(Foo,{},{
            header:h("p",{},"header"),
            footer:h('p',{},'footer')
        })
        return h('div',{},[app,foo])},
    setup(){
        return {
        }
    }
}