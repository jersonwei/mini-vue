export function shouldUpdateComponent(preVnode,nextVnode){

    const {props:preprops} = preVnode
    const {props:nextprops} = nextVnode

    for (const key in nextprops) {
        if(nextprops[key] !== preprops[key]){
            return true
        }else{
            return false
        }
    }
    


}
