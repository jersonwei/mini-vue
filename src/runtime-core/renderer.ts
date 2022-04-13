import { isObject } from "../shared"
import { ShapeFlags } from "../shared/Shapeflags"
import { creatComponentInstance, setupComponent } from "./component"
import { Fragment,Text } from "./vnode"

export  function render(vnode,container){
    // 构建patch方法 方便后续的递归
    patch(vnode,container,null)
}

function patch(vnode,container,parentComponent){
    const {type,shapeFlag} = vnode
    // 增加一种类型只渲染我们的children
    // Fragment => 只渲染我们的children
    switch (type) {
        case Fragment:
            processFragment(vnode,container,parentComponent)   
            break;
        case Text:
            processText(vnode,container)   
        break;
        default:     // vnode => flag 我们当前虚拟节点的类型都称之为我们的flag
        // 比如我们的字符串就作为元素来对待
        // if(typeof vnode.type === 'string'){
        if(shapeFlag & ShapeFlags.ELEMENT ){ 
            // 上面的判断可以使用位运算符来进行替换
            // 当虚拟节点的类型是一个字符串时,就作为一个元素节点
            processElement(vnode,container,parentComponent)
            // isObject(vnode.type) 同样进行替换
        }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
            processComponent(vnode,container,parentComponent)
        }
            break;
    }

    // 去处理组件

    // 判断 是不是 element类型
    // 是element类型就处理element
    // processElement()
    // 是component就处理component
    // console.log(vnode.type,vnode)
    // shapeflags
}
function processText(vnode:any,container:any){
    const {children} = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
}
function processFragment(vnode,container,parentComponent){    
    // implement    
    // mountChildren的功能实际上就是遍历了我们的children 并再次进行patch
    mountChildren(vnode,container,parentComponent)
}
// 作为元素的处理方式
function processElement(vnode:any,container:any,parentComponent){
    // element 主要有初始化init和更新update
    mountElement(vnode,container,parentComponent)
}
function mountElement(vnode:any,container:any,parentComponent){
    // 作为元素的处理  基于vnode来创建元素
    // 我们所谓的虚拟节点中的内容主要由 type props children 这里的type一般有string和array
    // 还是按照我们正常创建元素的方式来创建虚拟DOM
    // 这里的el是属于我们的element类型也就是div的,并不是我们认为的初始化的虚拟节点
    const el = (vnode.el = document.createElement(vnode.type))
    // string array
    const {children,shapeFlag} = vnode
    // 字符串类型的处理方式
    // children
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){ 
    // if(typeof children === 'string'){
        // textchildren
        el.textContent = children;
        // arraychildren
        // Array.isArray(children)
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
        // 逻辑抽离 函数封装
        mountChildren(vnode,el,parentComponent)
        // children.forEach(v=>{
            // patch(v,el)
        // })        
    }
    // props
    const {props} = vnode
    for (let key in props) {
        const val = props[key]
        const isOn = key=> /^on[A-Z]/.test(key)
        console.log(key)
        // 如果我们的key是我们的onclick我们就可以给他添加一个点击事件
        if(isOn(key)){
            el.addEventListener(key.slice(2).toLowerCase(),val)
        }else{
            el.setAttribute(key,val)
        }
    }
    container.append(el)
}
function mountChildren(vnode,container,parentComponent){
    vnode.children.forEach(v=>{
        patch(v,container,parentComponent)
    })
}
function processComponent(vnode:any,container:any,parentComponent){  
    mountComponent(vnode,container,parentComponent)
}

function mountComponent(initialvnode:any,container,parentComponent){
    // throw new Error('Function not implementd')
   const instance =  creatComponentInstance(initialvnode,parentComponent)

   setupComponent(instance)
    setupRenderEffect(instance,initialvnode,container)
}


function setupRenderEffect(instance:any,initialvnode,container){
    const {proxy} = instance
    const subTree = instance.render.call(proxy);

    // vndoeTree => patch
    // vnode => element =>mountElement
    patch(subTree,container,instance)

    // 我们这里的subTree就是我们的根节点,我们所要赋值的el可以在subTree上找到
    // 传入我们的虚拟节点
    initialvnode.el = subTree.el
}





