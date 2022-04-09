


export function creatComponentInstance(vnode){
    const component = {
        vnode,
        type:vnode.type,
        setupState:{}
    }
    return component
}

export function setupComponent(instance){
    // TODO 
   // initProps()
   // initSlots()
    instance.proxy = new Proxy({},{
        get(target,key){
            // 先从setupstate中获取值
            const {setupState} = instance
            if(key in setupState){
                return setupState[key]
            }
        }
    })
    setupStatefulComponent(instance)
}

function setupStatefulComponent (instance:any){
    const component = instance.vnode.type


    const {setup} = component


    if(setup){
        // 我们的setup可以返回一个对象或者是函数
        // 当我们返回一个函数时 就可以把它认为是我们的render函数
        // 如果返回的是一个对象 会把这个对象注入到我们组件的上下文中
        const setupResult = setup()

        handleSetupResult(instance,setupResult)
    }
}

function handleSetupResult(instance,setupResult:any){
    // function object 
    // TODO function

    if(typeof setupResult === 'object'){
        instance.setupState = setupResult
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



