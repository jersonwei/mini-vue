import {isReactive,reactive,isProxy} from '../reactive'
// 由effec拆分出来的测试块
describe('reactive',()=>{
    
    it('happy path',()=>{
        // 6-继续初始化对象
        const original = {foo:1};                  
        // 7-设置响应对象
        const observed = reactive(original);
        // 8-断言两者内存地址不一致,但内部数据一致
        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
        // 接下来就需要去实现

        // 66 我们的对象是否是isReactive类型的判断  去到reactive实现 验证了我们的对象是否是一个PROXY
        expect(isReactive(observed)).toBe(true)
        // 69 接下来验证我们的对象如果不是一个PROXY 会不会出错
        expect(isReactive(original)).toBe(false)
        // 96-加入判断是否为Proxy的断言
        expect(isProxy(observed)).toBe(true)
    }
    )

    // 85 解决reactive对象有嵌套对象的case  回到我们basehandler返回的res
    test('nested reactive',()=>{
        const original = {
            nested:{
                foo:1
            },
            array:[{bar:2}]
        };
        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    }
    )

}

)