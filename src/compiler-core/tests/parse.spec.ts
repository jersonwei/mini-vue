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
        tag:'div'
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
            type:NodeTypes.SIMPLE_EXPRESSION,
            content:'message'
            }
        ]

        
    })


})