import {track,trigger} from './effect'
// 64 我们的 createGetter没必要每次都进行调用  可以利用缓存的作用在初始化时调用一次,后续只需要读取缓存
const get = createGetter()
// set也可以进行同样的处理
const set = createSetter()
const readonlyGet = createGetter(true)
function createGetter(isReadonly = false){
    return function get(target,key){
        const res = Reflect.get(target,key)
        if(!isReadonly){
            track(target,key)
        }
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