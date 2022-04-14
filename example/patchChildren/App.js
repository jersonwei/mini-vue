import {h} from '../../lib/guide-mini-vue.esm.js'
import ArrayToText from './ArrayToText.js'
// import ArrayToArray from './ArrayToAarray'
// import TextToText from './TextToText'
// import TextToArray from './TextToArray'
export default{
    name:"App",
    setup(){

    },
    render(){
        return h('div',{tId:1},[ 
            h('p',{},'主页'),
            // 老的是数组 新的是文本
            h(ArrayToText)
            // 老的是文本新的是文本
            // h(TextToText)
            // 老的是文本新的是数组
            // h(TextToArray)
            // 老的是数组新的数组
            //  h(ArrayToArray)
        ])

    }
   
}