

export function emit(instance,event,...args){
    console.log("emit",emit)
    // instance.props => event
    const {props} = instance
    // add => Add
    // add-foo => addFoo
    const cameLize = (str:string)=>{
        return str.replace(/-(\w)/g,(_,c:string)=>{
            return c?c.toUpperCase():''
        }
        )
    }
    

    const capitalize = (str:string)=>{
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    const toHandlerKey = (str:string)=>{
        return str? 'on' + capitalize(str):""
    }
    const handlerName = toHandlerKey(cameLize(event))

    // TPP 先去写一个特定的行为 在去重构成通用的行为
    const handler = props[handlerName]
    handler && handler(...args)
}   

