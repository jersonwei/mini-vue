import {reactive} from '../reactive'
import {effect} from '../effect'
// 22-此时去掉我们的user.age++步骤,执行我们的测试命令 会发现测试通过
// 此时我们剩下的问题就是依赖收集和触发依赖
describe('effect',()=>{
    it.skip('happy path',()=>{
        // 1-包装一个初始对象,设置初始值
        const user = reactive({
            age:10
        });

        let nextAge;
        // 2-设置响应对象
        effect(()=>{
            nextAge = user.age + 1
        }
        );
        // 3-断言出最后预计的结果
        expect(nextAge).toBe(11)

        // 4-初始对象的值发生变化 update
        user.age++;
        // 5-希望响应对象的值也发生同样的变化
       expect(nextAge).toBe(12);
})
}
)