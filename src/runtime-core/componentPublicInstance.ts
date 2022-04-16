import { hasOwn } from "../shared"

const publicPropertiesMap = {
    $el:(i)=> i.vnode.el,
    // $slots
    $slots:(i)=> i.slots,
    $props:(i)=> i.props
    
}
export const PublicInstanceProxyHandlers = {
    get({_:instance},key){
        // 先从setupstate中获取值
        const {setupState,props} = instance
        // if(key in setupState){
        //     return setupState[key]
        // }
        // 将上面的逻辑进行重构 加上我们的props的逻辑
        // const hasOwn = (val,key)=> Object.prototype.hasOwnProperty.call(val,key)
            if(hasOwn(setupState,key)){
                return setupState[key]
            }else if(hasOwn(props,key)){
                return props[key]
            }
        // key=>el
        const publicGetter = publicPropertiesMap[key]
        if(publicGetter){
            return publicGetter(instance)
        }
        // if(key === '$el'){
            // return instance.vnode.el
        // }
    }
}