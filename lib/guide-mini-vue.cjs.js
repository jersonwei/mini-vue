'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// 87定义并导出isObject函数
const isObject = (val) => {
    return val !== null && typeof val === 'object';
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
    instance.proxy = new Proxy({}, {
        get(target, key) {
            // 先从setupstate中获取值
            const { setupState } = instance;
            if (key in setupState) {
                return setupState[key];
            }
        }
    });
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
    if (typeof vnode.type === 'string') {
        // 当虚拟节点的类型是一个字符串时,就作为一个元素节点
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
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
    const el = (vnode.el = document.createElement(vnode.type));
    // string array
    const { children } = vnode;
    // 字符串类型的处理方式
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
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
        el.setAttribute(key, val);
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
function mountComponent(vnode, container) {
    // throw new Error('Function not implementd')
    const instance = creatComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vndoeTree => patch
    // vnode => element =>mountElement
    patch(subTree, container);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
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
