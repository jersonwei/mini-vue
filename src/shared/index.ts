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
