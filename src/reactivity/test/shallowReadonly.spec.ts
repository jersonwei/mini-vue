import { isReadonly,shallowReadonly } from "../reactive";

// 91 shallowReadonly 功能实现 所谓的shallowReadonly就是指我们只需要对我们对象的表层数据进行处理,不需要对嵌套的数据进行处理

describe('shallowReadonly',()=>{
    test('should not make non-reactive properties reactive',()=>{
        const props = shallowReadonly({n:{foo:1}});
        expect(isReadonly(props)).toBe(true)
        expect(isReadonly(props.n)).toBe(false)
    });
    // 95-基本逻辑代码完成后 引入readonly的set操作警告的断言  执行单侧成功  接下来我们实现isproxy的功能
    it('should call console.warn then when set',()=>{
        // console.warn()
        // mock    通过mock我们可以去构建一个假的警告方法 最后来进行验证
        console.warn = jest.fn()  // jest.fn会创建一个函数,这个函数上有一些特殊的属性可以方便我们后续去做断言测试
        const user = shallowReadonly({
            age:10
        });
        user.age = 11
        expect(console.warn).toHaveBeenCalled()
    })

})