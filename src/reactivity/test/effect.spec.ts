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
       // 40-effect功能的完善  在我们调用effec时其实有后续的一套功能执行  effect(fn)=> function(runner)=> return 返回值 

       // 43-逻辑完成执行测试
       it('should return runner when call runner',()=>{
       let foo = 10
       const runner = effect(()=>{
           foo++;
           return foo;
       }
       )
       expect(foo).toBe(11)
       const r = runner();
       expect(foo).toBe(12)
       expect(r).toBe('foo')
    }
    )

    // 44 实现effect的scheduler功能
    it('scheduler',()=>{
        //  通过effect的第二个参数给定的一个schecdule的 fn
        //  effect 第一次执行的时候还会执行fn
        //  当响应式对象set update 不会执行fn 而是执行scheduler
        //  如果说当执行runner的时候 会再次执行fn
        let dummy;
        let run:any;
        const scheduler = jest.fn(()=>{
            run = runner
        }
        );
        const obj = reactive({foo:1});
        const runner = effect(()=>{
            dummy = obj.foo
        },{ scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy.toBe(1));
        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        // should not run yet 
        expect(dummy).toBe(1);
        // manually run
        run();
        //  should have run
        expect(dummy).toBe(2)

        // 48- 基本逻辑完成 执行单元测试 结果通过
    })
})
}
)