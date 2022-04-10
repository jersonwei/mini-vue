import {h,renderSlots} from '../../lib/guide-mini-vue.esm.js'
export const Foo ={
    setup() {
        return {}
    },
    render(){
        const foo = h("p",{},"foo")
        // Foo .vnode . children
        console.log(this.$slots)
        // children ==> 必须是虚拟节点
        // 我们需要将内部的东西转换成虚拟节点

        // 将下面的逻辑封装成函数  帮助我们渲染我们的slots
        // 添加渲染指定位置的逻辑
        return h('div',{},[renderSlots(this.$slots,"header"),foo,renderSlots(this.$slots,"footer")])
    }
}