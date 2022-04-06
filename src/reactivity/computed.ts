import { ReactiveEffect } from "./effect"
// 引入 ReactiveEffect
class ComputedRefImp{
    private _dirty: boolean = true
    private _getter: any
    private _value:any
    private _effect:any
    constructor(getter){
            this._getter = getter
            // 133利用ReactiveEffect中触发的schduler避免去执行我们的run  
            this._effect = new ReactiveEffect(getter,()=>{
                if(!this._dirty){
                    this._dirty = true
                }
            })
    }
    //129 触发我们的get方法将computed包裹的方法进行返回
    get value(){
        // 131 当我们调用完一次get后 将这个状态锁住 不再调用我们的方法 只把相应的值给返回出去

        // 132 当我们依赖的响应式对象的值发生改变时应该去改变我们的dirty  
        // 去追踪我们的响应式对象的值发生变化时,我们可以利用effect中的ReactiveEffect


        if(this._dirty){
            // 初次调用才会进来  
            this._dirty = false
            return this._value = this._effect()
            // 这里的调用可以用我们的effect来替换
        }
        return this._value
    }
}
// 127 定义导出computed函数 
export function computed(getter){
    // 128 我们可以返回一个类的实例来实现,因为类中可以触发相应的方法
    return new ComputedRefImp(getter)
}