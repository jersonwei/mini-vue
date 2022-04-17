const extend = Object.assign;
// 87定义并导出isObject函数
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
// 108 定义并导出 hasChange函数
const hasChanged = (value, newValue) => {
    return !Object.is(value, newValue);
};
// 将我们的hasOwn函数提取导出
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
// 对emit字符串绑定事件的处理函数
const cameLize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? 'on' + capitalize(str) : "";
};

// 32- 全局fn状态变量定义,当fn被执行时将其指向我们的实例对象
let activeEffect;
let shouldTrack;
// 17-根据面向对象思想,我们抽离出一个类来执行
class ReactiveEffect {
    // 21-我们可以通过内部的构造函数来替换一个等价的fn 下面调用得也就换成了this._fn
    constructor(fn, scheduler) {
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
    }
    // 20-响应下面的函数调用来创造一个run函数
    run() {
        // 33-将实例对象指向全局变量
        activeEffect = this;
        // 77 我们的收集依赖其实就是在我们的run函数调用后执行的  因此我们可以在这里进行响应的区分
        // 我们可以用active来判断是否是stop状态
        if (!this.active) {
            // 78 当前状态为stop直接调用我们的fn并返回
            return this._fn();
        }
        // 79 不是我们的stop状态就控制我们的全局变量的状态
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        // 调用完后重置状态
        shouldTrack = false;
        // 42- 接下方的函数调用,我们需要将fn的返回值返回出去,将下面的方法调用return
        //return this._fn()
        return result; // 80  
    }
    ;
    // 51-实现stop方法
    stop() {
        // 53执行dep的清空 后执行我们的单侧
        // 54优化 将dep清空提取出来
        // 55防止多次调用后重复执行已经清空的循环  我们可以添加一个状态判断
        if (this.active) {
            cleanupEffect(this);
            // 58-stop的回调函数,在其后面执行
            if (this.onStop) {
                this.onStop();
            }
        }
        this.active = false;
        // this.deps.forEach((dep:any)=>{
        //     dep.delete(this)
        // })
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0; // 小的优化
}
// 26- 根据Map容器来进行键值对存储 这样可以替换下面的dep定义
const targetMap = new Map();
// 82  activeEffect 和 shouldTrack都要用来判断是否在track转态 以此来命名包装函数
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
// 24- 定义并导出收集依赖函数
function track(target, key) {
    //  81-这两行代码我们依旧可以进行一定的优化  用一个函数来包装  
    if (!isTracking())
        return;
    // if(!activeEffect) return; 
    // if(!shouldTrack) return
    // 27-根据target取到我们的key,dep集合容器
    // 29-解决初始化不存在的问题
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        // 没有我们就创建一个并存储
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    // 28-取到我们的dep
    let dep = depsMap.get(key);
    // 30-与上面同理解决初始化的问题
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
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
    trackEffects(dep);
    // 31- 这时候我们可以将fn放到dep当中  我们可以定义一个全局状态变量,来判断fn是否成功加入
    // 所谓的收集依赖 就是当我们引入了对象中的每一个key时就需要一个容器将相应的依赖放入其中
    // 25-因为我们的依赖是不可重复的,我们可以利用Set来处理
    // const dep = new Set()
    // 我们的target,key,dep的关系是一一对应的,所谓我们可以一一对应的存储  target=>key=>dep
}
// 101 对于ref用到的track中的逻辑代码进行抽离封装导出
function trackEffects(dep) {
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
// 36- 定义并导出我们的trigger
function trigger(target, key) {
    // 37-基于target,key 找到所有的dep并调用其中的fn
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
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
}
// 104 抽离ref中用到的代码进行封装导出
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
// 16- 与reactive相同 导出effect
// 45- 接受第二个参数
function effect(fn, options = {}) {
    // 因为是触发响应,所以接受的是一个函数fn 并且需要先调用一次
    // const scheduler = options.scheduler
    // 18 创建上面类的一个实例,并将fn传入进去
    const _effect = new ReactiveEffect(fn, options.scheduler); // 47 将 scheduler传入到构造函数中去,并接受他
    //  57 将onStop引入到类中
    // _effect.onStop = options.onStop  
    // 59 代码优化  使用extend  这些公共的工具函数我们可以将其抽离到指定文件夹内 src/shared
    // Object.assign(_effect,options)  
    extend(_effect, options);
    // 19-我们希望可以通过该实例调用上面类的方法时来间接调用fn函数
    _effect.run();
    // 41- 结回effect中的调用 在这里就相当于是调用了实例的方法.我们可以返回该函数  在通过一些处理
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    // $slots
    $slots: (i) => i.slots,
    $props: (i) => i.props
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // 先从setupstate中获取值
        const { setupState, props } = instance;
        // if(key in setupState){
        //     return setupState[key]
        // }
        // 将上面的逻辑进行重构 加上我们的props的逻辑
        // const hasOwn = (val,key)=> Object.prototype.hasOwnProperty.call(val,key)
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // key=>el
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
        // if(key === '$el'){
        // return instance.vnode.el
        // }
    }
};

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // attr
}

// 65 我们的 createGetter没必要每次都进行调用  可以利用缓存的作用在初始化时调用一次,后续只需要读取缓存
const get = createGetter();
// set也可以进行同样的处理
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        // 68 判断我们的value是否触发了get
        // console.log(key)   下面我们就可以根据这个key来判断是否是我们的reactive
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) { // 进行IS_READONLY的判断
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        // 94 如果我们的类型是shallowReadonly就不需要进行下面的逻辑代码,我们可以借鉴readonly的执行,引入一个状态变量
        if (shallow) {
            return res;
        }
        // 86 我们可以判断我们的res是否是一个对象 如果是的话可以将子对象进行转换
        // isObject这种全局方法我们可以抽离到index中去
        if (isObject(res)) {
            // 90 当我们的res属于readonly是不应该执行我们的reactive 所以需要在此处进行判断
            // 逻辑完成后执行测试 测试通过
            return isReadonly ? readonly(res) : reactive(res);
            // return reactive(res)
        }
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutibleHandlers = {
    // get:createGetter,
    get,
    // set:createSetter
    set
};
const readonlyHandlers = {
    // get:createGetter(true),
    get: readonlyGet,
    // readonly中的set不需要处理 因为它是只读的
    set(target, key, value) {
        console.warn(`key:"${String(key)}" set 失败 因为 target 是 readonly`, target);
        return true;
    }
};
// 93 shallowReadonlyHandlers 所谓的不需要进行深层次的处理 就要回到我们上面的track也就是收集依赖的进程中去进行逻辑处理
// 我们的shallowReadonlyHandlers应该和我们的readonly很类似 我们可以利用之前的extend工具进行对象整合
// 94 因为整合了我们的readonlyHandlers我们可以吧readonlyHandlers的警告用例也使用上
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

// import { track,trigger } from "./effect";
function reactive(raw) {
    // 10-recative在本质上就是利用proxy来实现的代理和拦截
    // 11-因此我们需要明白什么时候去触发他的Get和Set
    // 注意需要在config中设置lib开启DOM和ES6
    // return new Proxy(raw,mutibleHandlers
    return createReactivepObject(raw, mutibleHandlers);
    // target 指向的就是我们的对象,key指向的就是我们访问的属性 比如之前foo
    // get(target,key){
    //     // 12-使用Reflect将拦截的值映射出去,与PROXY配合使用
    //     const res = Reflect.get(target,key)
    //     // 缺少的步骤 未收集初始对象的所有依赖  TODO 依赖收集
    //     track(target,key) // 23-依赖收集 在effect中进行处理
    //     return res ;
    // }
    // get:createGetter(),
    // set:createSetter()
    // 13-前两个参数与上面的相同,value就是对应的key指向的值
    // set(target,key,value){
    //     // 14-同样使用Reflect
    //     const res = Reflect.set(target,key,value)
    //     // 同样缺少的是触发所有的依赖  TODO  触发依赖
    //     // 35-trigger实现同样在effect中
    //     trigger(target,key)
    //     return res;
    //     // 15-此时执行单元测试命令 yarn test reactive会发现测试通过
    // }
    // )
}
// 61 定义导出readonly
function readonly(raw) {
    // 同样也是返回一个Proxy  因为不需要set所以不需要进行依赖收集和触发依赖
    return createReactivepObject(raw, readonlyHandlers);
    // return new Proxy(raw,readonlyHandlers
    // get(target,key){
    //     const res = Reflect.get(target,key)
    //     // track(target,key)
    //     return res ;
    // }
    // get:createGetter(true),
    // set(target,key,value){
    // const res = Reflect.set(target,key,value)  不需要进行映射
    // trigger(target,key)
    // return true;
    // )
}
// 92 定义导出shallowReadonly
function shallowReadonly(raw) {
    // 回到我们的baseHandlers去创建
    return createReactivepObject(raw, shallowReadonlyHandlers);
}
// 63 继续抽离return proxy
function createReactivepObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}

function emit(instance, event, ...args) {
    console.log("emit", emit);
    // instance.props => event
    const { props } = instance;
    // add => Add
    // add-foo => addFoo
    const handlerName = toHandlerKey(cameLize(event));
    // TPP 先去写一个特定的行为 在去重构成通用的行为
    const handler = props[handlerName];
    handler && handler(...args);
}

function initSlots(instance, children) {
    // slots
    const { vnode } = instance;
    // 是SLOT组件才进行相应的处理
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
    // 判断children的数据类型做逻辑处理
    // instance.slots = Array.isArray(children)? children: [children] 
    // children为对象的处理方式
    // const slots = {}
    // for (const key in children) {
    //     const value = children[key]
    //     // slot
    //     slots[key] = normalizeSlotValue(value)
    // }
    // instance.slots = slots
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

// 111 函数抽离  回到ref执行我们的第三个单侧
function trackRefvalue(ref) {
    if (isTracking()) {
        // trackEffects(this.dep) 这里的this就是我们的ref
        trackEffects(ref.dep);
    }
}
// 100 定义一个类来执行逻辑
class Refimpl {
    constructor(value) {
        this.__v_isRef = true;
        // this._value = value
        // 113 判断我们的value是否是一个对象  如果是对象需要用我们的reactive进行处理
        // 注意的是我们在下面set中对比的时候 如果被reactive处理了返回的是一个Proxy对象
        // 而我们需要进行对比的是2个普通的对象
        // 我们可以吧value在进行判断之前进行一个存储
        this._rawValue = value;
        // this._value = isObject(value)?reactive(value):value
        this._value = convert(value); // 重构函数替换
        this.dep = new Set();
    }
    // 102 收集依赖完成
    get value() {
        // 105 在我们进行收集依赖之前需要判断是否被effect处理
        // 没处理activeEffect就为undefined
        // 110 下面这段代码我们也可以进行抽离
        // if(isTracking()){
        // trackEffects(this.dep)}
        trackRefvalue(this);
        return this._value;
    }
    // 103 set可以调用之前设置的trigger的逻辑,同样将ref用到的逻辑代码进行抽离
    set value(newValue) {
        // 106  当我们修改后的值与之前的值相同时不进行依赖的触发
        // 107  这段代码我们可以提取到我们的公共函数库中
        // if(Object.is(newValue,this._value)) return
        // 109 封装后的函数进行替换
        // 114 接受上面的处理后 此处进行对比的应该是我们的未被reactive包裹的value值
        if (hasChanged(newValue, this._rawValue)) {
            // 进到这里表示值发生改变 值发生改变才进行依赖触发
            // 104 在触发我们trigger之前一定是我们的value先发生了改变
            // 115 同样我们的newValue也需要进行判断处理  接下来我们可以对我们的逻辑代码进行重构
            this._rawValue = newValue;
            // 下面的三元我们可以进行一个抽离
            // this._value = isObject(newValue)?reactive(newValue):newValue
            this._value = convert(newValue); // 重构函数替换
            triggerEffects(this.dep);
        }
    }
}
// 116 三元对比的重构
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
// 99 定义并导出ref函数
function ref(value) {
    return new Refimpl(value);
}
// 118定义并导出isRef
function isRef(ref) {
    // 我们可以在类中创建一个标识
    // 119 双重取反排除undefined的报错 逻辑处理完成
    return !!ref.__v_isRef;
}
// 121 定义导出我们的unRef
function unRef(ref) {
    // 看看是不是ref => ref.value
    return isRef(ref) ? ref.value : ref;
}
// 123 定义导出proxyRefs
function proxyRefs(objectWithRefs) {
    // 设法让我们得知调用了ref的get和set方法
    return new Proxy(objectWithRefs, {
        get(target, key) {
            // get => age(ref)是ref对象就给他返回value值
            // not ref 返回他本身  这个逻辑实际上就是我们的unRef
            // 124 get逻辑实现完成
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            // 125 判断我们的对象是一个ref类型 并且它的值不是一个ref类型 这种情况才去修改它原先的值
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            }
            else {
                // 当给定对象的值是一个ref对象时 我们直接让他替换原先的值
                return Reflect.set(target, key, value);
            }
        }
    });
}

let currentInstance = null;
function creatComponentInstance(vnode, parent) {
    console.log("kaobei", parent);
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        next: null,
        slots: {},
        subTree: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        emit: () => { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO 
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.vnode.type;
    const { setup } = component;
    if (setup) {
        // currentInstance = instance
        setCurrentInstance(instance);
        // 我们的setup可以返回一个对象或者是函数
        // 当我们返回一个函数时 就可以把它认为是我们的render函数
        // 如果返回的是一个对象 会把这个对象注入到我们组件的上下文中
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object 
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    // Implement
    const Component = instance.type;
    // if(Component.render){  假设render一定有值
    instance.render = Component.render;
    // }
}
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        component: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    // children
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    // 如何判定给定的参数是一个slot参数 
    // 必须是一个组件节点 并且它的children必须是一个Object
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

// import { render } from "./renderer";
// render
function createAppAPI(render) {
    return function createAPP(rootComponent) {
        return {
            // 接受一个根容器
            mount(rootContainer) {
                // 在vue3都会将所有的元素转换成虚拟节点
                // 所有的逻辑操作都会基于vnode来执行
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function shouldUpdateComponent(preVnode, nextVnode) {
    const { props: preprops } = preVnode;
    const { props: nextprops } = nextVnode;
    for (const key in nextprops) {
        if (nextprops[key] !== preprops[key]) {
            return true;
        }
        else {
            return false;
        }
    }
}

const queue = [];
// 引入一个开关
let isFlushPending = false;
let p = Promise.resolve();
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
function queueJobs(job) {
    if (queue.includes(job)) ;
    else {
        queue.push(job);
    }
    queueFlush();
}
function queueFlush() {
    if (isFlushPending)
        return;
    isFlushPending = true;
    nextTick(flushJobs);
    // Promise.resolve().then(()=>{
    // 这段代码可以利用上面的nextTick来执行  将下面的代码进行抽离
    // })
}
function flushJobs() {
    isFlushPending = false; // 重置开关
    let job;
    while (job = queue.shift()) {
        job && job();
    }
}

function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText } = options;
    function render(vnode, container) {
        // 构建patch方法 方便后续的递归
        patch(null, vnode, container, null, null);
    }
    // 改为接受 两个虚拟节点 n1 表示之前的虚拟节点 n2表示最新的虚拟节点
    function patch(n1, n2, container, parentComponent, anchor) {
        const { type, shapeFlag } = n2;
        // 增加一种类型只渲染我们的children
        // Fragment => 只渲染我们的children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default: // vnode => flag 我们当前虚拟节点的类型都称之为我们的flag
                // 比如我们的字符串就作为元素来对待
                // if(typeof vnode.type === 'string'){
                if (shapeFlag & 1 /* ELEMENT */) {
                    // 上面的判断可以使用位运算符来进行替换
                    // 当虚拟节点的类型是一个字符串时,就作为一个元素节点
                    processElement(n1, n2, container, parentComponent, anchor);
                    // isObject(vnode.type) 同样进行替换
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
        // 去处理组件
        // 判断 是不是 element类型
        // 是element类型就处理element
        // processElement()
        // 是component就处理component
        // console.log(vnode.type,vnode)
        // shapeflags
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processFragment(n1, n2, container, parentComponent, anchor) {
        // implement    
        // mountChildren的功能实际上就是遍历了我们的children 并再次进行patch
        mountChildren(n2.children, container, parentComponent, anchor);
    }
    // 作为元素的处理方式
    function processElement(n1, n2, container, parentComponent, anchor) {
        // console.log('processElement')
        if (!n1) {
            // element 主要有初始化init和更新update
            mountElement(n2, container, parentComponent, anchor);
        }
        else {
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }
    function patchElement(n1, n2, container, parentComponent, anchor) {
        console.log('patchElement');
        console.log('n1', n1);
        console.log('n2', n2);
        console.log('container', container);
        const oldProps = n1.props || {};
        const newProps = n2.props || {};
        const el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent, anchor);
        patchProps(el, oldProps, newProps);
    }
    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapeFlag = n1.shapeFlag;
        const { shapeFlag } = n2;
        const c1 = n1.children;
        const c2 = n2.children;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            if (prevShapeFlag & 8 /* ARRAY_CHILDREN */) {
                // 1.把n1的元素(children)清空
                unmountChildren(n1.children);
            }
            if (c1 !== c2) {
                // 2.设置text
                hostSetElementText(container, c2);
            }
        }
        else {
            if (prevShapeFlag & 4 /* TEXT_CHILDREN */) {
                // 清空原来的文本  
                hostSetElementText(container, '');
                // 直接将children进行mount
                mountChildren(c2, container, parentComponent, anchor);
            }
            else {
                // diff array with array
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        const l2 = c2.length;
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        function isSomeVNodeType(n1, n2) {
            // type
            // key
            return n1.type === n2.type && n1.key === n2.key;
        }
        // 左侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            i++;
        }
        console.log(i);
        // 右侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            e1--;
            e2--;
        }
        // 新的比老的多 需要进行创建 
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1;
                const anchor = e2 + 1 < l2 ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        }
        else if (i > e2) { // 老的比新的多 需要删除
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        }
        else {
            // 中间乱序对比的部分
            let s1 = i; // e1
            let s2 = i; // e2
            const toBePatched = e2 - s2 + 1; // e2中乱序的数量
            let patched = 0; // 记录当前处理的数量
            const keyToNewIndexMap = new Map();
            const newIndexToOldIndexMap = new Array(toBePatched);
            //  判断是否需要进行移动  逻辑优化
            let moved = false;
            let maxNewIndexSoFar = 0;
            // 重置新节点数组的索引值
            for (let i = 0; i < toBePatched; i++) {
                newIndexToOldIndexMap[i] = 0;
            }
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i];
                keyToNewIndexMap.set(nextChild.key, i);
            }
            for (let i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                if (patched >= toBePatched) {
                    hostRemove(prevChild.el);
                    continue;
                }
                // 有key直接找映射表
                let newIndex;
                if (prevChild.key !== null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                }
                else { // 没有key继续遍历
                    for (let j = s2; j <= e2; j++) {
                        // 借助已经封装好的方法
                        if (isSomeVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }
                //    新值中没有老值,进行删除
                if (newIndex === undefined) {
                    hostRemove(prevChild.el);
                }
                else {
                    // 新值大于记录的值 重置最大的值
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
                        // 新值小于记录的值说明进行位置的移动
                        moved = true;
                    }
                    // 证明新节点是存在的  在此处将老节点进行遍历对新节点进行重新赋值
                    // 因为此处我们的索引计算包含了前面的部分所以需要减去前面的部分也就是s2
                    // 由于新节点可能在老节点中是不存在的 所以需要考虑到为0的情况 可以将我们的i加1处理
                    newIndexToOldIndexMap[newIndex - s2] = i + 1;
                    //    存在继续进行深度对比
                    patch(prevChild, c2[newIndex], container, parentComponent, null);
                    patched++;
                }
            }
            // 给最长递增子序列算法准备进行处理的数组
            const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []; // 需要进行位置的移动时才调用算法,减少不必要的逻辑代码
            let j = increasingNewIndexSequence.length - 1;
            // 获取到我们的最长递增子序列这是一个数组,需要将我们的老值进行遍历 然后
            // 利用两个指针分别指向我们的最长递增子序列和我们的老值 如果老值没有匹配 则说明需要进行位置移动
            // toBePatched就是我们的新值的中间乱序的长度
            for (let i = toBePatched - 1; i >= 0; i--) {
                const nextIndex = i + s2;
                const nextChild = c2[nextIndex];
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
                if (newIndexToOldIndexMap[i] === 0) {
                    // 在旧值中找不到新值的映射时就需要新创建
                    patch(null, nextChild, container, parentComponent, anchor);
                }
                else if (moved) { // 需要移动时才进入相关的逻辑判断
                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        console.log('需要进行位置移动');
                        hostInsert(nextChild.el, container, anchor);
                    }
                    else {
                        // 不需要进行移动的话 将j的指针右移
                        j--;
                    }
                }
            }
        }
    }
    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            //   remove
            //   insert
            hostRemove(el);
        }
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }
            if (Object.keys(oldProps).length > 0) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }
    function mountElement(vnode, container, parentComponent, anchor) {
        // canvas
        // new Element()
        // 作为元素的处理  基于vnode来创建元素
        // 我们所谓的虚拟节点中的内容主要由 type props children 这里的type一般有string和array
        // 还是按照我们正常创建元素的方式来创建虚拟DOM
        // 这里的el是属于我们的element类型也就是div的,并不是我们认为的初始化的虚拟节点
        const el = (vnode.el = hostCreateElement(vnode.type));
        // string array
        const { children, shapeFlag } = vnode;
        // 字符串类型的处理方式
        // children
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            // if(typeof children === 'string'){
            // textchildren
            el.textContent = children;
            // arraychildren
            // Array.isArray(children)
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            // 逻辑抽离 函数封装
            mountChildren(vnode.children, el, parentComponent, anchor);
            // children.forEach(v=>{
            // patch(v,el)
            // })        
        }
        // props
        const { props } = vnode;
        for (let key in props) {
            const val = props[key];
            // const isOn = key=> /^on[A-Z]/.test(key)
            // console.log(key)
            // // 如果我们的key是我们的onclick我们就可以给他添加一个点击事件
            // if(isOn(key)){
            //     el.addEventListener(key.slice(2).toLowerCase(),val)
            // }else{
            //     el.setAttribute(key,val)
            // }
            hostPatchProp(el, key, null, val);
        }
        // canvas
        // el.x = 10
        // addChild()
        // container.append(el)
        hostInsert(el, container, anchor);
    }
    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach(v => {
            patch(null, v, container, parentComponent, anchor);
        });
    }
    function processComponent(n1, n2, container, parentComponent, anchor) {
        // 当n1没有值时才进行创建
        if (!n1) {
            mountComponent(n2, container, parentComponent, anchor);
        }
        else {
            // 有值就进行更新逻辑
            updateComponent(n1, n2);
        }
    }
    function updateComponent(n1, n2) {
        const instance = n2.component = n1.component;
        //  判断组件实例是否应该更新
        if (shouldUpdateComponent(n1, n2)) {
            instance.next = n2;
            instance.update();
        }
        else {
            // 不需要更新时也需要将组件的状态进行更新
            n2.el = n1.el;
            instance.vnode = n2;
        }
    }
    function mountComponent(initialvnode, container, parentComponent, anchor) {
        // throw new Error('Function not implementd')
        const instance = initialvnode.component = creatComponentInstance(initialvnode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initialvnode, container, anchor);
    }
    function setupRenderEffect(instance, initialvnode, container, anchor) {
        instance.update = effect(() => {
            if (!instance.isMounted) {
                console.log('init');
                const { proxy } = instance;
                const subTree = instance.subTree = instance.render.call(proxy);
                // console.log(subTree)
                // vndoeTree => patch
                // vnode => element =>mountElement
                patch(null, subTree, container, instance, anchor);
                // 我们这里的subTree就是我们的根节点,我们所要赋值的el可以在subTree上找到
                // 传入我们的虚拟节点
                initialvnode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log('update');
                // 需要一个更新之后的vnode
                const { next, vnode } = instance;
                if (next) {
                    next.el = vnode.el;
                    updateComponentPreRender(instance, next);
                }
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;
                // console.log('current',subTree)
                // console.log('pre',prevSubTree)
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        }, {
            scheduler() {
                console.log('update -- scheduler');
                queueJobs(instance.update);
            }
        });
    }
    return {
        createApp: createAppAPI(render)
    };
}
function updateComponentPreRender(instance, nextVnode) {
    instance.vnode = nextVnode;
    instance.next = null;
    instance.props = nextVnode.props;
}
// 最长递增子序列算法
function getSequence(arr) {
    const p = arr.slice();
    const result = [0]; // 存储长度为i的递增子序列的索引
    let j, u, v, c;
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            // 把j赋值为数组最后一项 
            j = result[result.length - 1];
            // result存储的最后一个值小于当前值
            if (arr[j] < arrI) {
                //    存储在result更新前的最后一个索引的值
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            // 二分搜索 查找比arrI小的节点  更新result的值
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    // 回溯数组 找到最终的索引
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            // children是不可以有 array
            // 只需要把children 渲染出来
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

// 存值
function provide(key, value) {
    // getCurrentInstance必须在setup作用域下才能获取到有效的currentInstance
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
// 取值
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function')
                return defaultValue();
        }
    }
}

function createElement(type) {
    // console.log('createElement------------')
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    // console.log('patchProp---------------')
    const isOn = key => /^on[A-Z]/.test(key);
    // console.log(key)
    // 如果我们的key是我们的onclick我们就可以给他添加一个点击事件
    if (isOn(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), nextVal);
    }
    else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextVal);
        }
    }
}
function insert(child, parent, anchor) {
    // console.log('insert',el,parent)
    // parent.append(el)
    parent.insertBefore(child, anchor || null);
}
function remove(children) {
    const parent = children.parentNode;
    if (parent) {
        parent.removeChild(children);
    }
}
function setElementText(el, text) {
    el.textContent = text;
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
});
function createApp(...args) {
    return renderer.createApp(...args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, nextTick, provide, proxyRefs, ref, renderSlots };
