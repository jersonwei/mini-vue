// import { render } from "./renderer";
import { createVNode } from "./vnode";

// render

export function createAppAPI(render){

    return function createAPP( rootComponent){
        
        
        return {
            // 接受一个根容器
            mount(rootContainer){
                // 在vue3都会将所有的元素转换成虚拟节点
                // 所有的逻辑操作都会基于vnode来执行
                
                const vnode = createVNode(rootComponent);

                
                render(vnode,rootContainer)                
            }
        }
        
        
    }
   
}