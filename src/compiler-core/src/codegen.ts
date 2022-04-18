
export function generate(ast){

    let code = ''
    code += 'return '

    const functionName = 'render'
    const args = ['_ctx','_cache']
    const signature = args.join(', ')
    const node = ast.codegenNode
    code += `function ${functionName}(${signature}){`
    code += `return '${node.content}'`
    code += '}'


    return {code}
}