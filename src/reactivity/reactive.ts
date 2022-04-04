// import { track,trigger } from "./effect";
import { mutibleHandlers,readonlyHandlers } from "./baseHandlers";
// 9-定义并导出实现的函数
// 62代码重构优化
// function createGetter(isReadonly = false){
//         return function get(target,key){
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
export function reactive(raw){
    // 10-recative在本质上就是利用proxy来实现的代理和拦截
    // 11-因此我们需要明白什么时候去触发他的Get和Set
    // 注意需要在config中设置lib开启DOM和ES6


    // return new Proxy(raw,mutibleHandlers
    createActivepObject(raw,mutibleHandlers)
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
    createActivepObject(raw,readonlyHandlers)
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

// 63 继续抽离return proxy
function createActivepObject(raw:any,baseHandlers){
    return new Proxy(raw,baseHandlers)
}