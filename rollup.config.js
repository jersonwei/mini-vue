import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
// rollup 配置信息  天然支持我们的ESM语法
// rollup 不理解我们的ts语法,所以需要先安装对应的模块
export default{
    // 入口
    input:"./src/index.ts",
    // 出口
    output:[ 
        // 1.cjs => commomjs
        // 2. esm
        {
            format:'cjs',  // 标记着要打包成什么样
            file:pkg.main  // 打包后文件名
        },
        // esm的配置
        {
            format:'es',
            file:pkg.module
        }
    ],
    plugins:[
        // 引入即可
        typescript()
    ]
}