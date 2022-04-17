import { NodeTypes } from "./ast"

export function baseParse(content:string){
    // 创建上下文对象
    const context = createParseContext(content)
    return createRoot(parseChildren(context))    
}

function parseChildren(context){
    const nodes:any = []
    let node
    // 检测字符串是否以某某开头
    if(context.source.startsWith('{{')){
        node = parseInterpolation(context)
    }
    nodes.push(node)

    return nodes
}

function parseInterpolation(context){
    // {{message}}
    const openDelimiter = '{{'
    const closeDelimiter = '}}'
    const closeIndex = context.source.indexOf(closeDelimiter,openDelimiter.length)
    advanceBy(context,openDelimiter.length)

    const rawContentLength = closeIndex -openDelimiter.length
    // 未处理的
    const rawcontent = context.source.slice(0,rawContentLength)
    const content = rawcontent.trim()
    advanceBy(context,rawContentLength + closeDelimiter.length)
    // context.source = context.source.slice(rawContentLength + closeDelimiter.length)

    return {  
        type:NodeTypes.INTERPOLATION, 
            content:{
                type:NodeTypes.SIMPLE_EXPRESSION,
                content:content
            }
    }
}
function advanceBy(context:any,length:number){
    context.source = context.source.slice(length)
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