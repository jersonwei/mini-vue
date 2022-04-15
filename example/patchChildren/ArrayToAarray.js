// 新的是array
// 老的也是array

import {ref,h} from '../../lib/guide-mini-vue.esm.js'

// 1.左侧的对比
// (a,b)c
// (a,b)d e
// const prevChildren = [
//     h('p',{key:'A'},'A'),
//     h('p',{key:'B'},'B'),
//     h('p',{key:'C'},'C')
// ]
// const nextChildren = [
//     h('p',{key:'A'},'A'),
//     h('p',{key:'B'},'B'),
//     h('p',{key:'D'},'D'),
//     h('p',{key:'E'},'E')
// ]
// 2.右侧的对比
// a (b c)
// d e(b c)
const prevChildren = [
    h('p',{key:'A'},'A'),
    h('p',{key:'B'},'B'),
    h('p',{key:'C'},'C')
]
const nextChildren = [
    h('p',{key:'D'},'D'),
    h('p',{key:'E'},'E'),
    h('p',{key:'B'},'B'),
    h('p',{key:'C'},'C')
]
export default {
    name:'ArrayToArray',
    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange,
        }
    },
    render() {
        const self = this
        return self.isChange === true?h('div',{},nextChildren):h('div',{},prevChildren)
    },
}