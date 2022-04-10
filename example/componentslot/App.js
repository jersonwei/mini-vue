import {h} from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './foo.js'
export const App = {
    name:"App",
    render(){
        const app = h('div',{},"App")
        const foo = h(Foo,{},[h("p",{},"123"),h('p',{},'234')])
        return h('div',{},[app,foo])},
    setup(){
        return {
        }
    }
}