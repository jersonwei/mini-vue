

export function baseParse(content:string){
    // 创建上下文对象
    const context = createParseContext(content)
    return createRoot(parseChildren(context))    
}

function parseChildren(context){
    const nodes:any = []
    const node = parseInterpolation(context)
    nodes.push(node)

    return nodes
}

function parseInterpolation(context){
    // {{message}}
    const closeIndex = context.source.indexOf('}}',2)

    context.source = context.source.slice(2)

    const rawContentLength = closeIndex -2

    const content = context.source.slice(0,rawContentLength)

    console.log('context.source ',context.source)

    return {
        type:'interpolation',
            content:{
                type:'simple_expression',
                content:'message'
            }
    }
}


function createRoot(children){
    return {
        children
    }
}

function createParseContext(content:string):any{
    return{
        source:content
    }
}