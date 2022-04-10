export const extend = Object.assign;

// 87定义并导出isObject函数
export const isObject = (val)=>{
    return val !== null && typeof val === 'object'
}

// 108 定义并导出 hasChange函数
export const hasChanged= (value,newValue)=>{
    return !Object.is(value,newValue)
}

// 将我们的hasOwn函数提取导出
export const hasOwn = (val,key)=>Object.prototype.hasOwnProperty.call(val,key)

// 对emit字符串绑定事件的处理函数
export const cameLize = (str:string)=>{
    return str.replace(/-(\w)/g,(_,c:string)=>{
        return c?c.toUpperCase():''
    }
    )
}


export const capitalize = (str:string)=>{
    return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str:string)=>{
    return str? 'on' + capitalize(str):""
}