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
        // 具名插槽的实现 通过指定名字和指定的渲染位置
        // 实现作用域插槽  把我们foo组件内部的变量传出去
        const age = 10
        return h('div',{},[renderSlots(this.$slots,"header",{age}),foo,renderSlots(this.$slots,"footer")])
    }
}