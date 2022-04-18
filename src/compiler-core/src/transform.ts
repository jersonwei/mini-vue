import { NodeTypes } from "./ast"

export function transform(root,options={}){
    // 存储我们的初始值
    const context = createTransformContext(root,options)
    // 1 遍历 深度优先搜索
    traverseNode(root,context)

    createRootCodegen(root)
    root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root:any){
    root.codegenNode = root.children[0]
}

function createTransformContext(root:any,options:any):any{
    const context = {
        root,
        nodeTransforms:options.nodeTransforms || [],
        helpers: new Map(),
        helper(key){
            context.helpers.set(key,1)
        }
    }

    return context
}


function traverseNode(node:any,context){
    console.log(node)
    // if(node.type === NodeTypes.TEXT){
    //     node.content = node.content + ' mini-vue'
    // }
    const nodeTransforms = context.nodeTransforms
   for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i]
        transform(node)
   }

   switch (node.type) {
       case NodeTypes.INTERPOLATION:
           context.helper('toDisplayString')
           break;
   
       default:
           break;
   }


   tranversChildren(node,context)
    // const children = node.children

    // if(children){
    //    for (let i = 0; i < children.length; i++) {
    //         const node = children[i]
    //         traverseNode(node,context)
    //    }
    // }
}

function tranversChildren(node,context){
    const children = node.children

    if(children){
        for (let i = 0; i < children.length; i++) {
             const node = children[i]
             traverseNode(node,context)
        }
     }
}