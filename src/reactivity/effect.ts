import { extend } from "../shared";
// 32- 全局fn状态变量定义,当fn被执行时将其指向我们的实例对象
let activeEffect;
let shouldTrack;

// 17-根据面向对象思想,我们抽离出一个类来执行
export class ReactiveEffect{
    private  _fn:any;
    public scheduler:Function | undefined
    deps = [];
    active = true;
    onStop?: ()=> void; // 可有可无
    // 21-我们可以通过内部的构造函数来替换一个等价的fn 下面调用得也就换成了this._fn
    constructor(fn,scheduler?:Function){  // 加上public使其能够被外界获取到  
        this._fn = fn
        this.scheduler = scheduler
    }

    // 20-响应下面的函数调用来创造一个run函数
    run(){
    // 33-将实例对象指向全局变量
    activeEffect = this;

    // 77 我们的收集依赖其实就是在我们的run函数调用后执行的  因此我们可以在这里进行响应的区分
    // 我们可以用active来判断是否是stop状态
    if(!this.active){
    // 78 当前状态为stop直接调用我们的fn并返回
       return this._fn()
    }
    // 79 不是我们的stop状态就控制我们的全局变量的状态
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    // 调用完后重置状态
    shouldTrack =false
    // 42- 接下方的函数调用,我们需要将fn的返回值返回出去,将下面的方法调用return
    //return this._fn()
        return  result // 80  
    };
    // 51-实现stop方法
    stop(){
        // 53执行dep的清空 后执行我们的单侧
        // 54优化 将dep清空提取出来
        // 55防止多次调用后重复执行已经清空的循环  我们可以添加一个状态判断
        if(this.active){
            cleanupEffect(this)
            // 58-stop的回调函数,在其后面执行
            if(this.onStop){
                this.onStop();
            }
        }
        this.active = false
        // this.deps.forEach((dep:any)=>{
        //     dep.delete(this)
        // })
    }
}
function cleanupEffect(effect){
    effect.deps.forEach((dep:any)=>{
        dep.delete(effect)
    })
    effect.deps.length = 0 // 小的优化
}
// 26- 根据Map容器来进行键值对存储 这样可以替换下面的dep定义
    const targetMap = new Map() 

// 82  activeEffect 和 shouldTrack都要用来判断是否在track转态 以此来命名包装函数
export function isTracking(){
    return  shouldTrack && activeEffect !== undefined
}

// 24- 定义并导出收集依赖函数
export function track(target,key){
    //  81-这两行代码我们依旧可以进行一定的优化  用一个函数来包装  
    if(!isTracking()) return
    // if(!activeEffect) return; 
    // if(!shouldTrack) return

    // 27-根据target取到我们的key,dep集合容器

    // 29-解决初始化不存在的问题
    let depsMap = targetMap.get(target);
    if(!depsMap){
        // 没有我们就创建一个并存储
        depsMap = new Map()
        targetMap.set(target,depsMap);
    }
    // 28-取到我们的dep
    let dep = depsMap.get(key)
    // 30-与上面同理解决初始化的问题
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }
    // 60 解决activeEffect可能为undefinded的报错  执行yarn test发现测试通过

    // if(!activeEffect) return;   80-这段代码可以置顶,避免多余的dep操作,因为这个过程不需要进行依赖收集 

    // 34-这时候当我们获取到依赖时就可以建立起联系  下面我们就可以去实现trigger了

    // 76 对我们的stop优化加一个状态的判断

    // if(!shouldTrack) return    80-这段代码可以置顶,避免多余的dep操作,因为这个过程不需要进行依赖收集

    // 83  这里面也可以进行一个优化,当我们的dep池中已经有activeEffect这个依赖 可以跳过后续的过程

    // if(dep.has(activeEffect)) return
    // dep.add(activeEffect)  
    // 52- 将activeEffect与我们的dep进行反向联系 我们可以在activeEffect中定义一个deps去进行反向收集
    // activeEffect.deps.push(dep)
    trackEffects(dep)
    // 31- 这时候我们可以将fn放到dep当中  我们可以定义一个全局状态变量,来判断fn是否成功加入
    // 所谓的收集依赖 就是当我们引入了对象中的每一个key时就需要一个容器将相应的依赖放入其中
    // 25-因为我们的依赖是不可重复的,我们可以利用Set来处理
    // const dep = new Set()
    // 我们的target,key,dep的关系是一一对应的,所谓我们可以一一对应的存储  target=>key=>dep
};
// 101 对于ref用到的track中的逻辑代码进行抽离封装导出
export function trackEffects(dep){
    if(dep.has(activeEffect)) return
    dep.add(activeEffect)  
    activeEffect.deps.push(dep)

}

// 36- 定义并导出我们的trigger
export function trigger(target,key){
    // 37-基于target,key 找到所有的dep并调用其中的fn
    
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

    triggerEffects(dep)
    // 38-循环dep调用即可
    // for (const effect of dep) {
    // 46-响应数据时也就是执行我们的run  但是当我们第二次执行时需要调用scheduler 而不是调用run函数中的fn函数
    // if(effect.scheduler){
        // effect.scheduler()
    // }else{
        // effect.run()
    // }
    // }
    // 39-运行yarn test执行所有的单元测试通过
};
// 104 抽离ref中用到的代码进行封装导出
export function triggerEffects(dep){
    for (const effect of dep) {
        if(effect.scheduler){
            effect.scheduler()
        }else{
            effect.run()
        }   
    }
}

// 16- 与reactive相同 导出effect

// 45- 接受第二个参数
export function effect(fn,options:any = {}){
    // 因为是触发响应,所以接受的是一个函数fn 并且需要先调用一次
    // const scheduler = options.scheduler
    // 18 创建上面类的一个实例,并将fn传入进去
    const _effect = new ReactiveEffect(fn,options.scheduler)  // 47 将 scheduler传入到构造函数中去,并接受他
    //  57 将onStop引入到类中
    // _effect.onStop = options.onStop  
    // 59 代码优化  使用extend  这些公共的工具函数我们可以将其抽离到指定文件夹内 src/shared
    // Object.assign(_effect,options)  
    extend(_effect,options)
    // 19-我们希望可以通过该实例调用上面类的方法时来间接调用fn函数
    _effect.run();


    // 41- 结回effect中的调用 在这里就相当于是调用了实例的方法.我们可以返回该函数  在通过一些处理

    const runner:any = _effect.run.bind(_effect)
    runner.effect=_effect
    return runner
}

// 49-实现stop方法使其在调用后不在执行effect的方法,除非手动再次执行
export function stop(runner){
    // 50-为了让我们的实例去执行我们的stop函数,需要在上面的effect函数中产生联系,并返回  下面我们就回到类中去实现这个方法
    runner.effect.stop()
}