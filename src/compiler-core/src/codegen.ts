
export function generate(ast){
    const context = createCodegenContext()
    const {push} = context
    
    const VueBinging = "Vue"
    // const helpers = ["toDisplayString"]
    const aliasHelper = (s)=>`${s}:_${s}`;
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinging}`)
    push('\n')
    push('return ')
    // let code = ''
    // code += 'return '

    const functionName = 'render'
    const args = ['_ctx','_cache']
    const signature = args.join(', ')
    // const node = ast.codegenNode

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
    const {push} = context
    // const node = ast.codegenNode
    push(`'${node.content}'`)
    // code += `return '${node.content}'`
    // return code
}




