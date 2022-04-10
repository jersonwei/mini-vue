import { ShapeFalgs } from "../shared/Shapeflags"

export function createVNode(type,props?,children?){

     const vnode = {
        type,
        props,
        children,
        shapeFlag:getShapeFlag(type),
        el:null
    }
    if(typeof children === 'string'){
        vnode.shapeFlag |= ShapeFalgs.Textchildren
    }else if(Array.isArray(children)){
        vnode.shapeFlag |= ShapeFalgs.Arraychildren
    }
    return vnode

}

function getShapeFlag(type){
    return typeof type === 'string' ? ShapeFalgs.Element:ShapeFalgs.Stateful_Component
}