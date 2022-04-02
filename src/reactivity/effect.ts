// 16- 与reactive相同 到处effect

// 17-根据面向对象思想,我们抽离出一个类来执行
class ReactiveEffect{
    private  _fn:any;
    // 21-我们可以通过内部的构造函数来替换一个等价的fn 下面调用得也就换成了this._fn
    constructor(fn){
        this._fn = fn
    }

    // 20-响应下面的函数调用来创造一个run函数
    run(){
    // 33-将实例对象指向全局变量
    activeEffect = this;
        this._fn()
    }
}
// 26- 根据Map容器来进行键值对存储 这样可以替换下面的dep定义
    const targetMap = new Map() 
// 24- 定义并导出收集依赖函数
export function track(target,key){
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
    }
    // 34-这时候当我们获取到依赖时就可以建立起联系  下面我们就可以去实现trigger了
    dep.add(activeEffect)
    // 31- 这时候我们可以将fn放到dep当中  我们可以定义一个全局状态变量,来判断fn是否成功加入
    // 所谓的收集依赖 就是当我们引入了对象中的每一个key时就需要一个容器将相应的依赖放入其中
    // 25-因为我们的依赖是不可重复的,我们可以利用Set来处理
    // const dep = new Set()
    // 我们的target,key,dep的关系是一一对应的,所谓我们可以一一对应的存储  target=>key=>dep
};
// 36- 定义并导出我们的trigger
export function trigger(target,key){
    // 37-基于target,key 找到所有的dep并调用其中的fn
    
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    // 38-循环dep调用即可
    for (const effect of dep) {
        effect.run()
    }
    // 39-运行yarn test执行所有的单元测试通过
};
// 32- 全局fn状态变量定义,当fn被执行时将其指向我们的实例对象
let activeEffect;
export function effect(fn){
    // 因为是触发响应,所以接受的是一个函数fn 并且需要先调用一次

    // 18 创建上面类的一个实例,并将fn传入进去
    const _effect = new ReactiveEffect(fn)

    // 19-我们希望可以通过该实例调用上面类的方法时来间接调用fn函数
    _effect.run();





}