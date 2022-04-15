




export const enum ShapeFlags{
    // 利用位运算进行查和改  修改就使用我们的或.查找就使用我们的与
    ELEMENT = 1,  // 0001
    STATEFUL_COMPONENT = 1 << 1,  // 0010
    TEXT_CHILDREN = 1 << 2, // 0100
    ARRAY_CHILDREN = 1 << 3, // 1000
    SLOT_CHILDREN = 1 << 4
}