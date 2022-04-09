import { isObject } from "../shared"
import { creatComponentInstance, setupComponent } from "./component"

export  function render(vnode,container){
    // 构建patch方法 方便后续的递归
    patch(vnode,container)
}

function patch(vnode,container){

    // 去处理组件

    // 判断 是不是 element类型
    // 是element类型就处理element
    // processElement()
    // 是component就处理component
    console.log(vnode.type,vnode)
    if(typeof vnode.type === 'string'){
        // 当虚拟节点的类型是一个字符串时,就作为一个元素节点
        processElement(vnode,container)
    }else if(isObject(vnode.type)){
        processComponent(vnode,container)
    }

}
// 作为元素的处理方式
function processElement(vnode:any,container:any){
    // element 主要有初始化init和更新update
    mountElement(vnode,container)
}
function mountElement(vnode:any,container:any){
    // 作为元素的处理  基于vnode来创建元素
    // 我们所谓的虚拟节点中的内容主要由 type props children 这里的type一般有string和array
    // 还是按照我们正常创建元素的方式来创建虚拟DOM
    const el = document.createElement(vnode.type)
    // string array
    const {children} = vnode
    // 字符串类型的处理方式
    if(typeof children === 'string'){
        el.textContent = children;
    }else if(Array.isArray(children)){
        // 逻辑抽离 函数封装
        mountChildren(vnode,el)
        // children.forEach(v=>{
            // patch(v,el)
        // })        
    }
    // props
    const {props} = vnode
    for (let key in props) {
        const val = props[key]
        el.setAttribute(key,val)
    }
    container.append(el)
}
function mountChildren(vnode,container){
    vnode.children.forEach(v=>{
        patch(v,container)
    })
}
function processComponent(vnode:any,container:any){  
    mountComponent(vnode,container)
}

function mountComponent(vnode:any,container){
    // throw new Error('Function not implementd')
   const instance =  creatComponentInstance(vnode)

   setupComponent(instance)
    setupRenderEffect(instance,container)
}


function setupRenderEffect(instance:any,container){
    const {proxy} = instance
    const subTree = instance.render.call(proxy);

    // vndoeTree => patch
    // vnode => element =>mountElement
    patch(subTree,container)
}





