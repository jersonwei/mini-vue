// import { track,trigger } from "./effect";
import { isObject } from "../shared";
import { mutibleHandlers,readonlyHandlers,shallowReadonlyHandlers } from "./baseHandlers";
// 9-定义并导出实现的函数
// 62代码重构优化
// function createGetter(isReadonly = false){
//         return function get(target,key){.
//             const res = Reflect.get(target,key)
//             if(!isReadonly){
//                 track(target,key)
//             }
//         }
// }
// function createSetter(){
//     return function set(target,key,value){
//         const res =Reflect.set(target,key,value)
//         trigger(target,key)
//         return res
//     }
// }

// 68 将我们的value调用抽离出来 使用一个枚举
export const enum ReactiveFlags{
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw){
    // 10-recative在本质上就是利用proxy来实现的代理和拦截
    // 11-因此我们需要明白什么时候去触发他的Get和Set
    // 注意需要在config中设置lib开启DOM和ES6


    // return new Proxy(raw,mutibleHandlers
    return createReactivepObject(raw,mutibleHandlers)
        // target 指向的就是我们的对象,key指向的就是我们访问的属性 比如之前foo
        // get(target,key){
        //     // 12-使用Reflect将拦截的值映射出去,与PROXY配合使用
        //     const res = Reflect.get(target,key)

        //     // 缺少的步骤 未收集初始对象的所有依赖  TODO 依赖收集
        //     track(target,key) // 23-依赖收集 在effect中进行处理
        //     return res ;
        // }

        // get:createGetter(),
        // set:createSetter()

        // 13-前两个参数与上面的相同,value就是对应的key指向的值
        // set(target,key,value){
        //     // 14-同样使用Reflect
        //     const res = Reflect.set(target,key,value)

        //     // 同样缺少的是触发所有的依赖  TODO  触发依赖
        //     // 35-trigger实现同样在effect中
        //     trigger(target,key)
        //     return res;
        //     // 15-此时执行单元测试命令 yarn test reactive会发现测试通过
        // }
    
        // )
}

// 61 定义导出readonly
export function readonly(raw){
    // 同样也是返回一个Proxy  因为不需要set所以不需要进行依赖收集和触发依赖
    return createReactivepObject(raw,readonlyHandlers)
    // return new Proxy(raw,readonlyHandlers
        // get(target,key){
        //     const res = Reflect.get(target,key)

        //     // track(target,key)
        //     return res ;
        // }
        // get:createGetter(true),
        // set(target,key,value){
            // const res = Reflect.set(target,key,value)  不需要进行映射
            // trigger(target,key)
            // return true;
        
    // )
}

// 92 定义导出shallowReadonly
export function shallowReadonly(raw){
    // 回到我们的baseHandlers去创建
    return createReactivepObject(raw,shallowReadonlyHandlers)
}

// 67 定义isReactive的出口
export function isReactive(value){
    // 分析  我们在creatGetter中传入了一个readonly变量已经帮助我们来区分我们的get操作的是一个什么类型
    // 当我们的value进行调用时其实就会触发我们的get

    // return value['is_reactive']
    // 70 当我们的vaklue中不是一个proxy,没有挂载reactive类时,会结算为undefined,此时将他进行一个布尔值运算即可   
    return !!value[ReactiveFlags.IS_REACTIVE]
}

// 72 定以isReadonly出口
export function isReadonly(value){
    // 73同样在ReactiveFlags中进行挂载 然后在我们的creatGetter中进行判断
    return !!value[ReactiveFlags.IS_READONLY]
}
// 97-定义并导出是否为Proxy函数逻辑
export function isProxy(value){
    // 逻辑代码只需要判断是否为响应式对象即可
    return  isReactive(value) || isReadonly(value)
}
// 63 继续抽离return proxy
function createReactivepObject(target,baseHandlers){
    if(!isObject(target)){
        console.warn( `target${target} 必须是一个对象`)
        return target
    }
    return new Proxy(target,baseHandlers)
}
