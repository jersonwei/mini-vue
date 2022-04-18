import { NodeTypes } from "./ast"

export function generate(ast){
    const context = createCodegenContext()
    const {push} = context
    
    genFunctionPreamble(ast,context)
    // const VueBinging = "Vue"
    // const helpers = ["toDisplayString"]
    // const aliasHelper = (s)=>`${s}:_${s}`;
    // push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
    // push('\n')
    // push('return ')
    // let code = ''
    // code += 'return '

    const functionName = 'render'
    const args = ['_ctx','_cache']
    const signature = args.join(', ')
    // const node = ast.codegenNode
    console.log(ast)
    push(`function ${functionName}(${signature}){`)
    // code += `function ${functionName}(${signature}){`
    push(`return`)
    // code += `return`
    genNode(ast.codegenNode,context)
    // code = genNode(ast,code)
    push('}')
    // code += '}'

    return {code:context.code}
}

function genFunctionPreamble(ast,context){
    const {push} = context
    const VueBinging = "Vue"
    // const helpers = ["toDisplayString"]
    const aliasHelper = (s)=>`${s}:_${s}`;
    if(ast.helpers.length>0){
        push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
    }
    push('\n')
    push('return ')
}

function createCodegenContext():any{
   const context = {
       code:'',
       push(source){
           context.code += source
       }
   }
   return context
}

function genNode(node:any,context){
    switch (node.type) {
        case NodeTypes.TEXT:
            genText(node,context)
            // Text类型
            // const {push} = context
            // const node = ast.codegenNode
            // push(`'${node.content}'`)
            // code += `return '${node.content}'`
            // return code
            break;
        case NodeTypes.INTERPOLATION:

            geninterpolation(node,context)
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node,context)
        default:
            break;
    }

}

function genExpression(node:any,context:any){
    const {push} = context

    push(`_ctx.${node.content}`)
}

function genText(node:any,context:any){
    const {push} = context
    push(`'${node.content}'`)
}

function geninterpolation(node:any,context:any){
    const {push} = context
    push(`_toDisplayString(`)
    genNode(node.content,context)
    push(")")
}

