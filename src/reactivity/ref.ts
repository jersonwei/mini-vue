import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects,triggerEffects } from "./effect";
import { reactive } from "./reactive";
// 111 函数抽离  回到ref执行我们的第三个单侧
function trackRefvalue(ref){
    if(isTracking()){
        // trackEffects(this.dep) 这里的this就是我们的ref
        trackEffects(ref.dep)
    }
}
// 100 定义一个类来执行逻辑
class Refimpl {
    // 当我们对ref进行依赖收集时 其实可以直接调用我们的track函数,但是我们的ref对应的值只有一个value
    // 所以我们需要对track函数中用到的逻辑进行一个抽离.我们也可以在类中去创建一个dep
    public dep;
    private _value: any;
    private _rawValue: any;
    public __v_isRef = true;
    constructor(value) {
        // this._value = value
        // 113 判断我们的value是否是一个对象  如果是对象需要用我们的reactive进行处理
        // 注意的是我们在下面set中对比的时候 如果被reactive处理了返回的是一个Proxy对象
        // 而我们需要进行对比的是2个普通的对象
        // 我们可以吧value在进行判断之前进行一个存储
        this._rawValue = value
        // this._value = isObject(value)?reactive(value):value
        this._value = convert(value)  // 重构函数替换
        this.dep =  new Set()
    }
    // 102 收集依赖完成
    get value(){
        // 105 在我们进行收集依赖之前需要判断是否被effect处理
        // 没处理activeEffect就为undefined

        // 110 下面这段代码我们也可以进行抽离
        // if(isTracking()){
            // trackEffects(this.dep)}
        trackRefvalue(this)
        return this._value
    }
    // 103 set可以调用之前设置的trigger的逻辑,同样将ref用到的逻辑代码进行抽离
    set value(newValue){
        // 106  当我们修改后的值与之前的值相同时不进行依赖的触发
        // 107  这段代码我们可以提取到我们的公共函数库中
        // if(Object.is(newValue,this._value)) return
        // 109 封装后的函数进行替换
        // 114 接受上面的处理后 此处进行对比的应该是我们的未被reactive包裹的value值
        if(hasChanged(newValue,this._rawValue)){
            // 进到这里表示值发生改变 值发生改变才进行依赖触发
            // 104 在触发我们trigger之前一定是我们的value先发生了改变
        // 115 同样我们的newValue也需要进行判断处理  接下来我们可以对我们的逻辑代码进行重构
            this._rawValue = newValue
        // 下面的三元我们可以进行一个抽离
            // this._value = isObject(newValue)?reactive(newValue):newValue
            this._value =convert(newValue)     // 重构函数替换
            triggerEffects(this.dep)
        }
    }
}
// 116 三元对比的重构
    function convert(value){
      return  isObject(value)?reactive(value):value
    }

// 99 定义并导出ref函数
export function ref(value){
    return new Refimpl(value)
}

// 118定义并导出isRef
export function isRef(ref){
    // 我们可以在类中创建一个标识
    // 119 双重取反排除undefined的报错 逻辑处理完成
    return !!ref.__v_isRef
}
// 121 定义导出我们的unRef
export function unRef(ref){
    // 看看是不是ref => ref.value
    return isRef(ref)?ref.value:ref;
}

// 123 定义导出proxyRefs
export function proxyRefs(objectWithRefs){
    // 设法让我们得知调用了ref的get和set方法
    return new Proxy(objectWithRefs,{
        get(target,key){
        // get => age(ref)是ref对象就给他返回value值
        // not ref 返回他本身  这个逻辑实际上就是我们的unRef
        // 124 get逻辑实现完成
        return unRef(Reflect.get(target,key))
        },
        set(target,key,value){
            // 125 判断我们的对象是一个ref类型 并且它的值不是一个ref类型 这种情况才去修改它原先的值
            if(isRef(target[key]) && !isRef(value)){
               return target[key].value = value
            }else{
                // 当给定对象的值是一个ref对象时 我们直接让他替换原先的值
                return Reflect.set(target,key,value)
            }
        }
    })
}