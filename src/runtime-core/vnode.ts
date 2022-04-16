import { ShapeFlags } from "../shared/Shapeflags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode(type,props?,children?){

     const vnode = {
        type,
        props,
        children,
        component:null,
        key:props && props.key,
        shapeFlag:getShapeFlag(type),
        el:null
    }
    // children
    if(typeof children === 'string'){
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    }else if(Array.isArray(children)){
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    // 如何判定给定的参数是一个slot参数 
    // 必须是一个组件节点 并且它的children必须是一个Object
    if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
        if(typeof children === 'object'){
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
        }
    }
    return vnode

}

function getShapeFlag(type){
    return typeof type === 'string' ? ShapeFlags.ELEMENT:ShapeFlags.STATEFUL_COMPONENT
}

export function createTextVNode(text:string){
    return createVNode(Text,{},text)
}