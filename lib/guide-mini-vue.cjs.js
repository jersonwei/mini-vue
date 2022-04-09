'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function creatComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // TODO 
    // initProps()
    // initSlots()
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
    patch(vnode);
}
function patch(vnode, container) {
    // 去处理组件
    // 判断 是不是 element类型
    // 是element类型就处理element
    // processElement()
    // 是component就处理component
    console.log(vnode.type, vnode);
    if (typeof vnode.type === 'string') ;
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    // throw new Error('Function not implementd')
    const instance = creatComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vndoeTree => patch
    // vnode => element =>mountElement
    patch(subTree);
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
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createAPP = createAPP;
exports.h = h;
