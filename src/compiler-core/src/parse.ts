

export function baseParse(content:string){


        return {
            children:[
                {
                    type:'interpolation',
                    content:{
                        type:'simple_expression',
                        content:'message'
                    }
                }
            ]
        }
}