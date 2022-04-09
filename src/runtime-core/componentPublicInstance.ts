const publicPropertiesMap = {
    $el:(i)=> i.vnode.el
    
}
export const PublicInstanceProxyHandlers = {
    get({_:instance},key){
        // 先从setupstate中获取值
        const {setupState} = instance
        if(key in setupState){
            return setupState[key]
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