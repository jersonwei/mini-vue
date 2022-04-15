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
// const prevChildren = [
//     h('p',{key:'A'},'A'),
//     h('p',{key:'B'},'B'),
//     h('p',{key:'C'},'C')
// ]
// const nextChildren = [
//     h('p',{key:'D'},'D'),
//     h('p',{key:'E'},'E'),
//     h('p',{key:'B'},'B'),
//     h('p',{key:'C'},'C')
// ]

// 3.新的比老的长左侧
//  创建新的
// 左侧
// (a,b)
// (a,b,c)
// i=2,e1 =1,e2=2
// const prevChildren = [h('p',{key:'A'},'A'),h('p',{key:'B'},'B')]
// const nextChildren = [
//         h('p',{key:'A'},'A'),
//         h('p',{key:'B'},'B'),
//         h('p',{key:'C'},'C'),
//         h('p',{key:'D'},'D')]

// 右侧
// (a,b)
// c (a,b)
// i=0 e1 = -1 e2 = 0
// const prevChildren = [h('p',{key:'A'},'A'),h('p',{key:'B'},'B')]
// const nextChildren = [
//         h('p',{key:'C'},'C'),
//         h('p',{key:'A'},'A'),
//         h('p',{key:'B'},'B')]

// 4 老的比新的长 右侧
// 删除老的
// 右侧
// (a,b) c d
// (a,b)
// const prevChildren = [h('p',{key:'A'},'A'),h('p',{key:'B'},'B'),h('p',{key:'C'},'C'),h('p',{key:'D'},'D')]
// const nextChildren = [
//         h('p',{key:'A'},'A'),
//         h('p',{key:'B'},'B')]
// 老的比新的长 左侧
// 删除老的
// a,b(c,d)
// (c,d)
const prevChildren = [h('p',{key:'A'},'A'),h('p',{key:'B'},'B'),h('p',{key:'C'},'C'),h('p',{key:'D'},'D')]
const nextChildren = [
        h('p',{key:'C'},'C'),
        h('p',{key:'D'},'D')]



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