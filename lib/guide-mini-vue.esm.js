const extend = Object.assign;
// 87定义并导出isObject函数
const isObject = (val) => {
    return val !== null && typeof val === 'object';
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

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    // $slots
    $slots: (i) => i.slots
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

// 26- 根据Map容器来进行键值对存储 这样可以替换下面的dep定义
const targetMap = new Map();
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
    // 判断children的数据类型做逻辑处理
    // instance.slots = Array.isArray(children)? children: [children] 
    // children为对象的处理方式
    const slots = {};
    for (const key in children) {
        const value = children[key];
        // slot
        slots[key] = Array.isArray(value) ? value : [value];
    }
    instance.slots = slots;
}

function creatComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        props: {},
        slots: {},
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
        // 我们的setup可以返回一个对象或者是函数
        // 当我们返回一个函数时 就可以把它认为是我们的render函数
        // 如果返回的是一个对象 会把这个对象注入到我们组件的上下文中
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object 
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
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

function render(vnode, container) {
    // 构建patch方法 方便后续的递归
    patch(vnode, container);
}
function patch(vnode, container) {
    // 去处理组件
    // 判断 是不是 element类型
    // 是element类型就处理element
    // processElement()
    // 是component就处理component
    console.log(vnode.type, vnode);
    // shapeflags
    // vnode => flag 我们当前虚拟节点的类型都称之为我们的flag
    // 比如我们的字符串就作为元素来对待
    const { shapeFlag } = vnode;
    // if(typeof vnode.type === 'string'){
    if (shapeFlag & 1 /* ELEMENT */) {
        // 上面的判断可以使用位运算符来进行替换
        // 当虚拟节点的类型是一个字符串时,就作为一个元素节点
        processElement(vnode, container);
        // isObject(vnode.type) 同样进行替换
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
// 作为元素的处理方式
function processElement(vnode, container) {
    // element 主要有初始化init和更新update
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // 作为元素的处理  基于vnode来创建元素
    // 我们所谓的虚拟节点中的内容主要由 type props children 这里的type一般有string和array
    // 还是按照我们正常创建元素的方式来创建虚拟DOM
    // 这里的el是属于我们的element类型也就是div的,并不是我们认为的初始化的虚拟节点
    const el = (vnode.el = document.createElement(vnode.type));
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
        mountChildren(vnode, el);
        // children.forEach(v=>{
        // patch(v,el)
        // })        
    }
    // props
    const { props } = vnode;
    for (let key in props) {
        const val = props[key];
        const isOn = key => /^on[A-Z]/.test(key);
        console.log(key);
        // 如果我们的key是我们的onclick我们就可以给他添加一个点击事件
        if (isOn(key)) {
            el.addEventListener(key.slice(2).toLowerCase(), val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialvnode, container) {
    // throw new Error('Function not implementd')
    const instance = creatComponentInstance(initialvnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialvnode, container);
}
function setupRenderEffect(instance, initialvnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vndoeTree => patch
    // vnode => element =>mountElement
    patch(subTree, container);
    // 我们这里的subTree就是我们的根节点,我们所要赋值的el可以在subTree上找到
    // 传入我们的虚拟节点
    initialvnode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
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
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}

function createAPP(rootComponent) {
    return {
        // 接受一个根容器
        mount(rootContainer) {
            // 在vue3都会将所有的元素转换成虚拟节点
            // 所有的逻辑操作都会基于vnode来执行
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name) {
    const slot = slots[name];
    if (slot) {
        return createVNode('div', {}, slot);
    }
}

export { createAPP, h, renderSlots };
