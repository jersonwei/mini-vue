import {h} from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './foo.js'
export const App = {
    name:"App",
    render(){
        // emit
        return h('div',{ 
        },
        [h("div",{},"App"),h(Foo,{})])
    },
    setup(){
        return {
        }
    }
}