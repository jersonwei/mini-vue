import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import {initProps} from './componentProps'
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initSlots } from "./componentSlots"
import { proxyRefs } from "../reactivity"
let currentInstance = null
export function creatComponentInstance(vnode,parent){
    console.log("kaobei",parent)
    const component = {
        vnode,
        type:vnode.type,
        setupState:{},
        props:{},
        next:null,
        slots:{},
        subTree:{},
        provides:parent?parent.provides:{},
        parent,
        isMounted:false,
        emit:()=>{}
    }
    component.emit = emit.bind(null,component) as any
    return component
}

export function setupComponent(instance){
    // TODO 
   initProps(instance,instance.vnode.props)
   initSlots(instance,instance.vnode.children)
    instance.proxy = new Proxy({_:instance},PublicInstanceProxyHandlers)
    setupStatefulComponent(instance)
}

function setupStatefulComponent (instance:any){
    const component = instance.vnode.type


    const {setup} = component


    if(setup){
        // currentInstance = instance
        setCurrentInstance(instance)
        // 我们的setup可以返回一个对象或者是函数
        // 当我们返回一个函数时 就可以把它认为是我们的render函数
        // 如果返回的是一个对象 会把这个对象注入到我们组件的上下文中
        const setupResult = setup(shallowReadonly(instance.props),{emit:instance.emit})
        setCurrentInstance(null)
        handleSetupResult(instance,setupResult)
    }
}

function handleSetupResult(instance,setupResult:any){
    // function object 
    // TODO function

    if(typeof setupResult === 'object'){
        instance.setupState = proxyRefs(setupResult) 
    }

    finishComponentSetup(instance)

}

function finishComponentSetup(instance:any){
    // Implement
    const Component = instance.type

    // if(Component.render){  假设render一定有值
        instance.render = Component.render
    // }
}

export function getCurrentInstance(){
    return currentInstance
}

export function setCurrentInstance(instance){
    currentInstance = instance
}