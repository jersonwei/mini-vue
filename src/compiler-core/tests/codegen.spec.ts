import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"


describe('codegen',()=>{


    it('string',()=>{

    const ast = baseParse('hi')

    transform(ast)

    const {code} = generate(ast)

    // 快照测试 对我们当前的code进行一次快照 当我们代码或逻辑改动 前后两次的快照不一样就会报错

    // 1.抓BUG
    // 2.有意更新
    expect(code).toMatchSnapshot()



    })


})