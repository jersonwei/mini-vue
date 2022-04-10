import { cameLize, toHandlerKey } from "../shared"

export function emit(instance,event,...args){
    console.log("emit",emit)
    // instance.props => event
    const {props} = instance
    // add => Add
    // add-foo => addFoo

    const handlerName = toHandlerKey(cameLize(event))

    // TPP 先去写一个特定的行为 在去重构成通用的行为
    const handler = props[handlerName]
    handler && handler(...args)
}   

