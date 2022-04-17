import { effect } from "../reactivity/effect"
import { isObject } from "../shared"
import { ShapeFlags } from "../shared/Shapeflags"
import { creatComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment,Text } from "./vnode"
import {shouldUpdateComponent} from './componentUpdateUtils'
import { queueJobs } from "./scheduler"
export function createRenderer(options){

    const {createElement:hostCreateElement,
    patchProp:hostPatchProp,
insert:hostInsert,
remove:hostRemove,
setElementText:hostSetElementText} = options
    
    function render(vnode,container){
        // 构建patch方法 方便后续的递归
        patch(null,vnode,container,null,null)
    }
// 改为接受 两个虚拟节点 n1 表示之前的虚拟节点 n2表示最新的虚拟节点
function patch(n1,n2,container,parentComponent,anchor){
    const {type,shapeFlag} = n2
    // 增加一种类型只渲染我们的children
    // Fragment => 只渲染我们的children
    switch (type) {
        case Fragment:
            processFragment(n1,n2,container,parentComponent,anchor)   
            break;
        case Text:
            processText(n1,n2,container)   
        break;
        default:     // vnode => flag 我们当前虚拟节点的类型都称之为我们的flag
        // 比如我们的字符串就作为元素来对待
        // if(typeof vnode.type === 'string'){
        if(shapeFlag & ShapeFlags.ELEMENT ){ 
            // 上面的判断可以使用位运算符来进行替换
            // 当虚拟节点的类型是一个字符串时,就作为一个元素节点
            processElement(n1,n2,container,parentComponent,anchor)
            // isObject(vnode.type) 同样进行替换
        }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
            processComponent(n1,n2,container,parentComponent,anchor)
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
function processText(n1,n2:any,container:any){
    const {children} = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
}
function processFragment(n1,n2,container,parentComponent,anchor){    
    // implement    
    // mountChildren的功能实际上就是遍历了我们的children 并再次进行patch
    mountChildren(n2.children,container,parentComponent,anchor)
}
// 作为元素的处理方式
function processElement(n1,n2:any,container:any,parentComponent,anchor){
    // console.log('processElement')
    if(!n1){
        // element 主要有初始化init和更新update
        mountElement(n2,container,parentComponent,anchor)
    }else{
        patchElement(n1,n2,container,parentComponent,anchor)
    }
}

function patchElement(n1,n2:any,container,parentComponent,anchor){
    console.log('patchElement')
    console.log('n1',n1)
    console.log('n2',n2)
    console.log('container',container)


    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    const el = (n2.el = n1.el)

    patchChildren(n1,n2,el,parentComponent,anchor)
    patchProps(el,oldProps,newProps)
}

function patchChildren(n1,n2,container,parentComponent,anchor){
    const prevShapeFlag = n1.shapeFlag
    const {shapeFlag} = n2
    const c1 = n1.children
    const c2 = n2.children
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
        if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
            // 1.把n1的元素(children)清空
            unmountChildren(n1.children) 
        }
        if(c1 !== c2){
               // 2.设置text
               hostSetElementText(container,c2)
           }
    }else{
        if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
            // 清空原来的文本  
            hostSetElementText(container,'')
            // 直接将children进行mount
            mountChildren(c2,container,parentComponent,anchor)
        }else{
            // diff array with array
            patchKeyedChildren(c1,c2,container,parentComponent,anchor)
        }
    }

}

function patchKeyedChildren(c1,c2,container,parentComponent,parentAnchor){
    const l2 = c2.length
    let i = 0
    let e1 = c1.length -1
    let e2 = l2 -1

    function isSomeVNodeType(n1,n2){
        // type
        // key
        return n1.type === n2.type && n1.key === n2.key
    }
    // 左侧
    while (i<= e1 && i<= e2) {
        const n1 = c1[i]
        const n2 = c2[i]
        if(isSomeVNodeType(n1,n2)){
            patch(n1,n2,container,parentComponent,parentAnchor)
        }else{
            break
        }
        i++
    }
    console.log(i)
    // 右侧
    while (i<= e1 && i<= e2) {
        const n1 = c1[e1]
        const n2 = c2[e2]
        if(isSomeVNodeType(n1,n2)){
            patch(n1,n2,container,parentComponent,parentAnchor)
        }else{
            break
        }
        e1--
        e2--
    }
    // 新的比老的多 需要进行创建 
    if(i>e1){
        if(i<=e2){
            const nextPos = e2 + 1
            const anchor = e2 + 1<l2?c2[nextPos].el:null 
            while (i<=e2) {
            patch(null,c2[i],container,parentComponent,anchor)            
            i++
        }
        }
    } else if(i>e2){ // 老的比新的多 需要删除
            while(i<=e1){
                hostRemove(c1[i].el)
                i++
            }
        }else{
            // 中间乱序对比的部分
            let s1 = i  // e1
            let s2 = i  // e2

            const toBePatched = e2-s2 + 1 // e2中乱序的数量
            let patched = 0  // 记录当前处理的数量
            const keyToNewIndexMap = new Map()

            const newIndexToOldIndexMap = new Array(toBePatched)

            //  判断是否需要进行移动  逻辑优化
            let moved = false
            let maxNewIndexSoFar = 0
            // 重置新节点数组的索引值
           for (let i = 0; i < toBePatched; i++) {
            newIndexToOldIndexMap[i] = 0
           }
           for (let i = s2; i <= e2; i++) {
               const nextChild = c2[i]
               keyToNewIndexMap.set(nextChild.key,i)
           }
           for (let i = s1; i <= e1; i++) {
               const prevChild = c1[i]

               if(patched >= toBePatched){
                   hostRemove(prevChild.el)
                   continue
               }
               // 有key直接找映射表
               let newIndex
               if(prevChild.key !== null){
                   newIndex = keyToNewIndexMap.get(prevChild.key)
               }else{  // 没有key继续遍历
                   for (let j = s2; j <= e2; j++) {
                       // 借助已经封装好的方法
                       if(isSomeVNodeType(prevChild,c2[j])){
                                newIndex = j

                                break
                       }
                   }
               }
            //    新值中没有老值,进行删除
               if(newIndex === undefined){
                   hostRemove(prevChild.el)
               }else{
                   // 新值大于记录的值 重置最大的值
                    if(newIndex>= maxNewIndexSoFar){
                        maxNewIndexSoFar = newIndex
                    }else{
                        // 新值小于记录的值说明进行位置的移动
                        moved = true
                    }

                   // 证明新节点是存在的  在此处将老节点进行遍历对新节点进行重新赋值
                   // 因为此处我们的索引计算包含了前面的部分所以需要减去前面的部分也就是s2
                    // 由于新节点可能在老节点中是不存在的 所以需要考虑到为0的情况 可以将我们的i加1处理
                   newIndexToOldIndexMap[newIndex-s2] = i + 1 
                //    存在继续进行深度对比
                   patch(prevChild,c2[newIndex],container,parentComponent,null)
                   patched++
               }
               
           }
           // 给最长递增子序列算法准备进行处理的数组
           const increasingNewIndexSequence:any = moved? getSequence(newIndexToOldIndexMap) :[] // 需要进行位置的移动时才调用算法,减少不必要的逻辑代码
           let j = increasingNewIndexSequence.length-1
           // 获取到我们的最长递增子序列这是一个数组,需要将我们的老值进行遍历 然后
           // 利用两个指针分别指向我们的最长递增子序列和我们的老值 如果老值没有匹配 则说明需要进行位置移动
           // toBePatched就是我们的新值的中间乱序的长度
          for (let i = toBePatched -1; i >= 0; i--) {
              const nextIndex = i +s2
              const nextChild = c2[nextIndex]
              const anchor = nextIndex + 1<l2?c2[nextIndex + 1].el :null
              if(newIndexToOldIndexMap[i] === 0){
                // 在旧值中找不到新值的映射时就需要新创建
                patch(null,nextChild,container,parentComponent,anchor)
              }else if(moved){ // 需要移动时才进入相关的逻辑判断
                  if( j<0 || i !== increasingNewIndexSequence[j]){
                      console.log('需要进行位置移动')
                      hostInsert(nextChild.el,container,anchor)
                    }else{
                        // 不需要进行移动的话 将j的指针右移
                        j--
                    }
                }
          }
        }
    

}

function unmountChildren(children){
    for(let i = 0; i < children.length; i++) {
        const el = children[i].el
        //   remove
        //   insert
        hostRemove(el)
    }
}

function patchProps(el,oldProps,newProps){
    if(oldProps !== newProps){

        for (const key in newProps) {
            const prevProp = oldProps[key]
        const nextProp = newProps[key]
        if(prevProp !== nextProp){
            hostPatchProp(el,key,prevProp,nextProp)
        }
    }
    if(Object.keys(oldProps).length > 0){

        for (const key in oldProps) {
            if(!(key in newProps)){
                hostPatchProp(el,key,oldProps[key],null)
            }
        }
    }   
}
}
function mountElement(vnode:any,container:any,parentComponent,anchor){
    // canvas
    // new Element()

    // 作为元素的处理  基于vnode来创建元素
    // 我们所谓的虚拟节点中的内容主要由 type props children 这里的type一般有string和array
    // 还是按照我们正常创建元素的方式来创建虚拟DOM
    // 这里的el是属于我们的element类型也就是div的,并不是我们认为的初始化的虚拟节点
    const el = (vnode.el = hostCreateElement(vnode.type))
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
        mountChildren(vnode.children,el,parentComponent,anchor)
        // children.forEach(v=>{
            // patch(v,el)
        // })        
    }
    // props
    const {props} = vnode
    for (let key in props) {
        const val = props[key]
        // const isOn = key=> /^on[A-Z]/.test(key)
        // console.log(key)
        // // 如果我们的key是我们的onclick我们就可以给他添加一个点击事件
        // if(isOn(key)){
        //     el.addEventListener(key.slice(2).toLowerCase(),val)
        // }else{
        //     el.setAttribute(key,val)
        // }
        hostPatchProp(el,key,null,val)
    }
    // canvas
    // el.x = 10
    // addChild()
    // container.append(el)
    hostInsert(el,container,anchor)
}
function mountChildren(children,container,parentComponent,anchor){
    children.forEach(v=>{
        patch(null,v,container,parentComponent,anchor)
    })
}
function processComponent(n1,n2:any,container:any,parentComponent,anchor){  
    // 当n1没有值时才进行创建
    if(!n1){
        mountComponent(n2,container,parentComponent,anchor)
    }else{
        // 有值就进行更新逻辑
        updateComponent(n1,n2)
    }
}

function updateComponent(n1,n2){
    const instance = n2.component = n1.component
    //  判断组件实例是否应该更新
    if(shouldUpdateComponent(n1,n2)){
        instance.next = n2
        instance.update()
    }else{
        // 不需要更新时也需要将组件的状态进行更新
        n2.el = n1.el
        instance.vnode = n2
    }
}

function mountComponent(initialvnode:any,container,parentComponent,anchor){
    // throw new Error('Function not implementd')
   const instance = initialvnode.component = creatComponentInstance(initialvnode,parentComponent)

   setupComponent(instance)
    setupRenderEffect(instance,initialvnode,container,anchor)
}


function setupRenderEffect(instance:any,initialvnode,container,anchor){

  instance.update =  effect(()=>{
        if(!instance.isMounted){
            console.log('init')
            const {proxy} = instance
            const subTree = instance.subTree =  instance.render.call(proxy);
            // console.log(subTree)
        // vndoeTree => patch
        // vnode => element =>mountElement
        patch(null,subTree,container,instance,anchor)
        
        // 我们这里的subTree就是我们的根节点,我们所要赋值的el可以在subTree上找到
        // 传入我们的虚拟节点
        initialvnode.el = subTree.el
        instance.isMounted = true
    }else{
        console.log('update')
        // 需要一个更新之后的vnode
            const {next,vnode} = instance
            if(next){
                next.el = vnode.el

                updateComponentPreRender(instance,next)
            }
            const {proxy} = instance
            const subTree = instance.render.call(proxy);
            const prevSubTree = instance.subTree

            instance.subTree = subTree
            // console.log('current',subTree)
            // console.log('pre',prevSubTree)
        patch(prevSubTree,subTree,container,instance,anchor)
    }
    },{
        scheduler(){
            console.log('update -- scheduler')
            queueJobs(instance.update)
        }
    })
}

    return {
        createApp:createAppAPI(render)
    }
}

function updateComponentPreRender(instance,nextVnode){
    instance.vnode = nextVnode
    instance.next = null

    instance.props = nextVnode.props
}

// 最长递增子序列算法

function getSequence(arr){
    const p = arr.slice()
    const result  = [0] // 存储长度为i的递增子序列的索引
    let i,j,u,v,c
    const len = arr.length
   for (let i = 0; i < len; i++) {
       const arrI = arr[i]
       if(arrI !== 0){
           // 把j赋值为数组最后一项 
           j = result[result.length-1]
           // result存储的最后一个值小于当前值
           if(arr[j] < arrI){
            //    存储在result更新前的最后一个索引的值
                p[i] = j
                result.push(i)
                continue
           }
           u = 0
           v = result.length -1
           // 二分搜索 查找比arrI小的节点  更新result的值
           while (u<v) {
               c =(u+v) >> 1
               if(arr[result[c]] <arrI){
                   u = c +1
               }else{
                   v = c 
               }
           }
           if(arrI < arr[result[u]]){
               if(u>0){
                   p[i] = result[u-1]
               }
               result[u] = i
           }
        }
    }
    u = result.length
    v = result[u-1]
    // 回溯数组 找到最终的索引
    while (u-- > 0) {
        result[u] = v
        v = p[v]
    }
    return result
}