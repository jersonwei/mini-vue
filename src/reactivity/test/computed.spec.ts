import {computed} from "../computed"
import { reactive } from "../reactive"
// 126 computed计算属性的断言
describe('computed',()=>{
    // 计算属性具有缓存功能
    it('happy path',()=>{
        const user = reactive({
            age:1
        })
        // 接受一个函数
        const age = computed(()=>{
            return user.age
        })

        expect(age.value).toBe(1)

    })

    // 第二个单侧
    it('should comput lazily',()=>{
        const value = reactive({
            foo:1
        })
        const getter = jest.fn(()=>{
            return value.foo
        })
        const cValue = computed(getter)

        // 130 lazy 计算属性的懒执行 不会重复调用
        expect(getter).not.toHaveBeenCalled()

        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)
        // should not compute again
        cValue.value
        expect(getter).toHaveBeenCalledTimes(1)
        
        // should not compute untill need 当给定的值发生变化时还是执行一次
        value.foo = 2  // set逻辑会触发我们的trigger 会重新执行我们的getter
        expect(getter).toBeCalledTimes(1)

        // now it should compute
        expect(cValue.value).toBe(2)
        expect(getter).toHaveBeenCalledTimes(2)

        // should not compute again
        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)
    })
})