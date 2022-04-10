

export function emit(instance,event){
    console.log("emit",emit)
    // instance.props => event
    const {props} = instance

    // TPP 先去写一个特定的行为 在去重构成通用的行为
    const handler = props['onAdd']
    handler && handler()
}   

