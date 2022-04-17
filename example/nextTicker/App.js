import {h} from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './foo.js'
export const App = {
    name:"App",
    render(){
        // emit
        return h('div',{ 
        },
        [h("div",{},"App"),h(Foo,{
            // emit类似于我们的element设置的on事件
            onAdd(a,b){
                // console.log("onAdd",a,b)
            },
            onAddFoo(){
                // console.log('onAddFoo')
            }
        })])
    },
    setup(){
        return {
        }
    }
}