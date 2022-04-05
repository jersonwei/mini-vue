import { isObject } from '../shared'
// 88-引入完成后单侧执行通过 接下来我们可以去实现与reactive类似的readonly功能 回到我们的测试用例
import {track,trigger} from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

// 65 我们的 createGetter没必要每次都进行调用  可以利用缓存的作用在初始化时调用一次,后续只需要读取缓存
const get = createGetter()
// set也可以进行同样的处理
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false){
    return function get(target,key){
        // 68 判断我们的value是否触发了get
        // console.log(key)   下面我们就可以根据这个key来判断是否是我们的reactive
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }else if(key === ReactiveFlags.IS_READONLY){  // 进行IS_READONLY的判断
            return !isReadonly
        }

        const res = Reflect.get(target,key)
        // 86 我们可以判断我们的res是否是一个对象 如果是的话可以将子对象进行转换
        // isObject这种全局方法我们可以抽离到index中去
        if(isObject(res)){
            // 90 当我们的res属于readonly是不应该执行我们的reactive 所以需要在此处进行判断
            // 逻辑完成后执行测试 测试通过
            return isReadonly? readonly(res):reactive(res)
            // return reactive(res)
        }

        if(!isReadonly){
            track(target,key)
        }
        return res
    }
}
function createSetter(){
return function set(target,key,value){
    const res =Reflect.set(target,key,value)
    trigger(target,key)
    return res
}
};

export const mutibleHandlers = {
    // get:createGetter,
    get,
    // set:createSetter
    set
}
export const readonlyHandlers = {
    // get:createGetter(true),
    get:readonlyGet,
// readonly中的set不需要处理 因为它是只读的
    set(target,key,value){
        console.warn(`key:${key} set 失败 因为 target 是 readonly`,target)
        return true;
}}