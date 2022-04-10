import {h,getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './foo.js'
export const App = {
    name:"App",
    render(){
        // emit
        return h('div',{},[ h('p',{},"getCurremtInstance Demo"),h(Foo)])
    },
    setup(){
        const instance = getCurrentInstance()
        console.log('App: ',instance)
    }
}