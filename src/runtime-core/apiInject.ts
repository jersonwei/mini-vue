import { getCurrentInstance } from "./component";



// 存值
export function provide(key,value){
    // getCurrentInstance必须在setup作用域下才能获取到有效的currentInstance
    const currentInstance:any = getCurrentInstance()

    if(currentInstance){
        const {provides} = currentInstance
        provides[key] = value
    }
}
// 取值
export function inject(key){
    const currentInstance:any = getCurrentInstance()

    if(currentInstance){
        const parentProvides = currentInstance.parent.provides
        return parentProvides[key]
    }
}