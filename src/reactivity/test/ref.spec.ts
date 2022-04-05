import { effect } from "../effect";
import { reactive } from "../reactive";
import {isRef, ref, unRef} from '../ref'
// 98 ref 单侧
describe('ref',()=>{
    // 101-基本的逻辑单侧
    it('happy path',()=>{
        const a = ref(1)
        expect(a.value).toBe(1)
    });

    // 102-第二个单侧
    it('should be reactive',()=>{
        const a = ref(1)
        let dummy;
        let calls = 0;
        effect(()=>{
            calls++;
            dummy = a.value
        });
        // 正常的依赖收集和触发依赖
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        // set功能   105 单侧执行通过
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
        // same value should be trigger  边缘case=>相同的值不会重复触发响应 只需要在我们的set中执行新旧值的判断即可
        a.value = 2;   // 逻辑代码完成后单侧通过
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
    })

    // 112 第三个单侧 当我们的ref接受一个对象时,判断是否会进行更新
    it('should make nested properties reactive',()=>{
        const a = ref({
            count:1
        });
        let dummy;
        effect(()=>{ 
            dummy = a.value.count
        });
        expect(dummy).toBe(1)
        a.value.count = 2;
        expect(dummy).toBe(2)
    })

    // 117 isRef工具函数
    // 逻辑代码完成 单侧执行成功
    it('isRef',()=>{
        const a = ref(1);
        const user = reactive({
            age:1
        })
        expect(isRef(a)).toBe(true),
        expect(isRef(1)).toBe(false)
        expect(isRef(user)).toBe(false)
    })

    // 120 unRef工具函数
    // 逻辑代码完成 单侧执行成功
    it('unRef',()=>{
        const a =ref(1);
        expect(unRef(a)).toBe(1);
        expect(unRef(1)).toBe(1);
    })
}
)