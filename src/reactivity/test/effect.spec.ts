import {reactive} from '../reactive'
import {effect,stop} from '../effect'
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
    });
    // stop功能实现 
    it('stop',()=>{
        let dummy;
        const obj = reactive({prop:1});
        const runner = effect(()=>{
            dummy = obj.prop
        }
        );
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);  // 当stop调用后响应值不再更新  但是当runner函数再次调用后又会继续更新

        // 75  stop功能的优化  obj.prop = 3 || obj.prop++  这两种表达式的测试结果不同，因为我们的obj.prop只涉及到我们的set
        // 而我们的 obj.prop++可以拆分为 obj.prop = obj.prop + 1 这个过程既包括了我们的get 也包括了我们的set
        // 而在触发我们的get操作时他又会去重新收集我们的依赖，这个过程抵消了我们stop中清除依赖的操作 所以导致我们的结果不同
        // 我们需要回到我们的trak函数中在收集依赖前对他进行一定的处理

        // obj.prop = 3;
        obj.prop++

        expect(dummy).toBe(2);

        // stopped effect should still be manually callable
        runner()
        expect(dummy).toBe(3);
    })

    // 56 onStop功能实现 所谓的onStop 就是当stop被执行时的一个确认stop被执行的函数,允许用户在这个函数中做一些事情 单侧如下
    it('onStop',()=>{
        const obj = reactive({
            foo:1
        });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(()=>{
            dummy = obj.foo;
        },{
            onStop,
        }
        );
        stop(runner)
        expect(onStop).toBeCalledTimes(1);
    }
    )
})
}
)