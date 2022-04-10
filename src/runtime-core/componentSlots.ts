export function initSlots(instance,children){
    // 判断children的数据类型做逻辑处理
    instance.slots = Array.isArray(children)? children: [children] 
}