

export const enum ShapeFalgs{
    // 利用位运算进行查和改  修改就使用我们的或.查找就使用我们的与
    Element = 1,  // 0001
    Stateful_Component = 1 << 1,  // 0010
    Textchildren = 1 << 2, // 0100
    Arraychildren = 1 << 3 // 1000
}