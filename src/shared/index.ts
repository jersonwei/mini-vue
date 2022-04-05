export const extend = Object.assign;

// 87定义并导出isObject函数
export const isObject = (val)=>{
    return val !== null && typeof val === 'object'
}