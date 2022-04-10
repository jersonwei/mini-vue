export function initSlots(instance,children){
    // 判断children的数据类型做逻辑处理
    // instance.slots = Array.isArray(children)? children: [children] 
    // children为对象的处理方式
    const slots = {}
    for (const key in children) {
        const value = children[key]
        // slot
        slots[key] = Array.isArray(value)? value: [value]
    }
    instance.slots = slots
}