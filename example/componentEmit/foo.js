import {h} from '../../lib/guide-mini-vue.esm.js'
export const Foo ={
    setup(props) {
        // porps.count
        // console.log(props)
        // 3 props是shallowReadOnly属性
        props.count++
    },
    render(){
        return h('div',{},"foo" + this.count)
    }
}