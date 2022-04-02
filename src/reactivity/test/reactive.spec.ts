import {reactive} from '../reactive'
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
    }
    )
}
)