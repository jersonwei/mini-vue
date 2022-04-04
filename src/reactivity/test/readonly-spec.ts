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
    )
}
)