// 新的是文本
// 老的也是文本

import {ref,h} from '../../lib/guide-mini-vue.esm.js'

const prevChildren = 'oldChildren'
const nextChildren = 'newChildren'

export default {
    name:'TextToText',
    setup() {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
    render(){
        const self  = this
        return self.isChange === true? h('div',{},nextChildren):h('div',{},prevChildren)
    }
}
