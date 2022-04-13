import { getCurrentInstance } from "./component";



// 存值
export function provide(key,value){
    // getCurrentInstance必须在setup作用域下才能获取到有效的currentInstance
    const currentInstance:any = getCurrentInstance()

    if(currentInstance){
        let {provides} = currentInstance
        const parentProvides = currentInstance.parent.provides
        // init
        if(provides === parentProvides){
            provides = currentInstance.provides = Object.create(parentProvides)
        }
        provides[key] = value
    }
}
// 取值
export function inject(key,defaultValue){
    const currentInstance:any = getCurrentInstance()

    if(currentInstance){
        const parentProvides = currentInstance.parent.provides
        if(key in parentProvides){
            return parentProvides[key]
        }else if(defaultValue){
            if(typeof defaultValue === 'function')
            return defaultValue()
        }
    }
}