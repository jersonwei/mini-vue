export function initSlots(instance,children){
    normalizeObjectSlots(children,instance.slots)
    // 判断children的数据类型做逻辑处理
    // instance.slots = Array.isArray(children)? children: [children] 
    // children为对象的处理方式
    // const slots = {}
    // for (const key in children) {
    //     const value = children[key]
    //     // slot
    //     slots[key] = normalizeSlotValue(value)
    // }
    // instance.slots = slots
}
function normalizeObjectSlots(children:any,slots:any){
    for (const key in children) {
        const value = children[key]
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props))
    }
}
function normalizeSlotValue(value){
  return  Array.isArray(value)? value: [value]
}