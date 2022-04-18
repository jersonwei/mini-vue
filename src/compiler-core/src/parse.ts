import { NodeTypes } from "./ast"

const enum TagType{
    Start,
    End
}
export function baseParse(content:string){
    // 创建上下文对象
    const context = createParseContext(content)
    return createRoot(parseChildren(context,''))    
}

function parseChildren(context,parentTag){
    const nodes:any = []
    while (!isEnd(context,parentTag)) {
        
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
    // text的处理
    if(!node){
        node = parseText(context)
    }
    nodes.push(node)
}
    return nodes
}
// 循环执行解析children的状态函数
function isEnd(context,parentTag){
    const s = context.source
    // 遇到结束标签
    if(parentTag && s.startsWith(`</${parentTag}>`)){
        return true
    }
    // 当source没有值
    return !s
}

function parseText(context:any){
    // 对我们children中的text进行逻辑拓展
    let endIndex = context.source.length // 默认值
    const endToken = ['<','{{']
   for (let i = 0; i < endToken.length; i++) {
       const index = context.source.indexOf(endToken[i])
       // 存在花括弧 需要停止
       if(index !== -1 && endIndex > index){
           endIndex = index
        }
    }

    // 主要步骤  1 获取内容content
    // const content = context.source.slice(0,context.source.length)
    const content = parseTextData(context,endIndex)
    
    // 2.推进编译进程
    // advanceBy(content,content.length)
    console.log(context.source)

    return {
        type:NodeTypes.TEXT,
        content:content
    }
}
// 提取裁剪方法
function parseTextData(context:any,length){
   const content =  context.source.slice(0,length)
   advanceBy(context,content.length)
   return content
}

function parseElement(context:any){
    // 解析tag 
    // 删除处理完成的代码
    const element:any = parseTag(context,TagType.Start)
    // 联合类型进行递归调用
    element.children = parseChildren(context,element.tag)
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
    // const rawcontent = context.source.slice(0,rawContentLength)
    const rawContent = parseTextData(context,rawContentLength)
    const content = rawContent.trim()
    advanceBy(context,closeDelimiter.length)
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