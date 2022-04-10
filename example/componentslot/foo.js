import {h} from '../../lib/guide-mini-vue.esm.js'
export const Foo ={
    setup() {
        return {}
    },
    render(){
        const foo = h("p",{},"foo")
        // Foo .vnode . children
        return h('div',{},[foo,this.$slots])
    }
}