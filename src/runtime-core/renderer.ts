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
    // shapefalgs
    // vnode => flag 我们当前虚拟节点的类型都称之为我们的flag
    // 比如我们的字符串就作为元素来对待
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
    // 这里的el是属于我们的element类型也就是div的,并不是我们认为的初始化的虚拟节点
    const el = (vnode.el = document.createElement(vnode.type))
    // string array
    const {children} = vnode
    // 字符串类型的处理方式
    // children
    if(typeof children === 'string'){
        // textchildren
        el.textContent = children;
        // arraychildren
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

function mountComponent(initialvnode:any,container){
    // throw new Error('Function not implementd')
   const instance =  creatComponentInstance(initialvnode)

   setupComponent(instance)
    setupRenderEffect(instance,initialvnode,container)
}


function setupRenderEffect(instance:any,initialvnode,container){
    const {proxy} = instance
    const subTree = instance.render.call(proxy);

    // vndoeTree => patch
    // vnode => element =>mountElement
    patch(subTree,container)

    // 我们这里的subTree就是我们的根节点,我们所要赋值的el可以在subTree上找到
    // 传入我们的虚拟节点
    initialvnode.el = subTree.el
}





