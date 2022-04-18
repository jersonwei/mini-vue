import { NodeTypes } from '../src/ast'
import {baseParse}  from '../src/parse'
describe('Parse',()=>{

    describe('interpolation',()=>{

        const ast = baseParse("{{message}}")

        // root 
        expect(ast.children[0]).toStrictEqual({
        type:NodeTypes.INTERPOLATION,
            content:{
                type:NodeTypes.SIMPLE_EXPRESSION,
                content:'message'
            }
        })
    })
})
describe('element',()=>{

    describe('simple element div',()=>{

        const ast = baseParse("<div></div>")

        // root 
        expect(ast.children[0]).toStrictEqual({
        type:NodeTypes.ELEMENT,
        tag:'div',
        children:[]
        })

        

    })

})

describe('text',()=>{

    it('simple text',()=>{

        const ast = baseParse("some text")

        // root 
        expect(ast.children[0]).toStrictEqual({
        type:NodeTypes.TEXT ,
        content:'some text'
        })

        

    })

})

// 三种联合类型的单侧
test('hello word',()=>{

    const ast = baseParse('<div>hi,{{message}}</div>')

    expect(ast.children[0]).toStrictEqual({
        type:NodeTypes.ELEMENT,
        tag:'div',
        children:[
            {
            type:NodeTypes.TEXT ,
            content:'hi,'},
            {
                type:NodeTypes.INTERPOLATION,
                content:{
                    type:NodeTypes.SIMPLE_EXPRESSION,
                    content:'message'
                }
            }
        ]

        
    })


})

// 嵌套元素的单侧
test('Nested element',()=>{
    const ast = baseParse('<div><p>hi</p>{{message}}</div>')

    expect(ast.children[0]).toStrictEqual({
        type:NodeTypes.ELEMENT,
        tag:'div',
        children:[
            {
            type:NodeTypes.ELEMENT,
            tag:'p',
            children:[{type:NodeTypes.TEXT ,
                content:'hi'
            }]
            },
            {
                type:NodeTypes.INTERPOLATION,
                content:{
                    type:NodeTypes.SIMPLE_EXPRESSION,
                    content:'message'
                }
            }
        ]
    })
})

    // 缺少结束标签希望会报错
    test('should throw error when lack end tag',()=>{
        expect(()=>{
            baseParse('<div><span></div>')
        }).toThrow(`缺少结束标签:span`)
    })

