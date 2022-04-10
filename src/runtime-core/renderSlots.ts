import { createVNode, Fragment } from "./vnode";

export function renderSlots(slots,name,props){
    const slot = slots[name]
    if(slot){
        if(typeof slot === 'function'){
            // children是不可以有 array
            // 只需要把children 渲染出来
            return createVNode(Fragment,{},slot(props))
        }
    }
}