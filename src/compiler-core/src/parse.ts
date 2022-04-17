

export function baseParse(content:string){
    // 创建上下文对象
    const context = createParseContext(content)
    return createRoot(parseChildren(context))    
}

function parseChildren(context){
    const nodes:any = []
    const node = parseInterpolation()
    nodes.push(node)

    return nodes
}

function parseInterpolation(){
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