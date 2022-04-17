

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
    const openDelimiter = '{{'
    const closeDelimiter = '}}'
    const closeIndex = context.source.indexOf(closeDelimiter,openDelimiter.length)

    context.source = context.source.slice(openDelimiter.length)

    const rawContentLength = closeIndex -openDelimiter.length

    const content = context.source.slice(0,rawContentLength)

    context.source = context.source.slice(rawContentLength + closeDelimiter.length)

    return {
        type:'interpolation',
            content:{
                type:'simple_expression',
                content:content
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