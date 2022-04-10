// 组件 provide 和 inject功能
import {h,provide,inject} from '../../lib/guide-mini-vue.esm'

const Provider = {
    name:"Provider",
    setup(){
        provide("foo","fooVal")
        provide("foo","barVal")
    },
    render() {
        return h("div",{},[h("p",{},"Provider"),h(Consumer)]) 
    },
}

const Consumer = {
    name:"Consumer",
    setup(){
        const foo = inject("foo")
        const bar = inject("bar")
        return {
            foo,
            bar
        }
    },
    render(){
        return h("div",{},`Consumer: -${this.foo} - ${this.bar}`)
    }
}

export default{
    name:'App',
    setup(){},
    render(){
        return h('div',{},[h("p",{},{apiInject},h(Provider))])
    }
}