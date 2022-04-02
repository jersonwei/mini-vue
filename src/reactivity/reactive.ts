import { track,trigger } from "./effect";
// 9-定义并导出实现的函数
export function reactive(raw){
    // 10-recative在本质上就是利用proxy来实现的代理和拦截
    // 11-因此我们需要明白什么时候去触发他的Get和Set
    // 注意需要在config中设置lib开启DOM和ES6


    return new Proxy(raw,{
        // target 指向的就是我们的对象,key指向的就是我们访问的属性 比如之前foo
        get(target,key){
            // 12-使用Reflect将拦截的值映射出去,与PROXY配合使用
            const res = Reflect.get(target,key)

            // 缺少的步骤 未收集初始对象的所有依赖  TODO 依赖收集
            track(target,key) // 23-依赖收集 在effect中进行处理
            return res ;
        },
        // 13-前两个参数与上面的相同,value就是对应的key指向的值
        set(target,key,value){
            // 14-同样使用Reflect
            const res = Reflect.set(target,key,value)


            // 同样缺少的是触发所有的依赖  TODO  触发依赖
            // 35-trigger实现同样在effect中
            trigger(target,key)
            return res;
            // 15-此时执行单元测试命令 yarn test reactive会发现测试通过
        }
    })

}