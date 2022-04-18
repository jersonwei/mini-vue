import { NodeTypes } from "./ast"

const enum TagType{
    Start,
    End
}
export function baseParse(content:string){
    // 创建上下文对象
    const context = createParseContext(content)
    return createRoot(parseChildren(context))    
}

function parseChildren(context){
    const nodes:any = []
    let node
    // 检测字符串是否以某某开头
    const s = context.source
    if(s.startsWith('{{')){
        node = parseInterpolation(context)
        // 首位是左尖括号
    }else if(s[0] === '<'){
        // 第二位是字母
        if(/[a-z]/i.test(s[1])){
            console.log('element')
           node = parseElement(context)
        }
    }
    nodes.push(node)
    
    return nodes
}

function parseElement(context:any){
    // 解析tag 
    // 删除处理完成的代码
    const element = parseTag(context,TagType.Start)
    parseTag(context,TagType.End)
    console.log('------------',context.source)

    return element
}

function parseTag(context:any,type:TagType){
    const match:any = /^<\/?([a-z]*)/i.exec(context.source)
    console.log(match)
    const tag = match[1]
    // 2 删除处理完成的代码
    advanceBy(context,match[0].length)
    advanceBy(context,1)
    console.log(context.source)
    if(type === TagType.End) return
    return {
        type:NodeTypes.ELEMENT,
        tag,
    }
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