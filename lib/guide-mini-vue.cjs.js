'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // 先从setupstate中获取值
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
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

function creatComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null
    };
    return component;
}
function setupComponent(instance) {
    // TODO 
    // initProps()
    // initSlots()
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
        const setupResult = setup();
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
        console.log(key);
        // 如果我们的key是我们的onclick我们就可以给他添加一个点击事件
        if (key === 'onClick') {
            el.addEventListener('click', val);
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

exports.createAPP = createAPP;
exports.h = h;
