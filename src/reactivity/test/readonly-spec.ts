// 60 readonly功能实现 该方法是由reactive导出
import {readonly} from '../reactive'
describe('readonly',()=>{
    it('happy path',()=>{
        // not set
        const original = {foo:1,bar:{baz:2}};
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1);
    }
    );
    // 64 readonly的第二个功能点 调用set发出警告
    it('warning then call set',()=>{
        // console.warn()
        // mock    通过mock我们可以去构建一个假的警告方法 最后来进行验证
        console.warn = jest.fn()  // jest.fn会创建一个函数,这个函数上有一些特殊的属性可以方便我们后续去做断言测试
        const user = readonly({
            age:10
        });
        user.age = 11
        expect(console.warn).toBeCalled
    }
    )
}
)