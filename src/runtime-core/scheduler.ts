const queue:any[] = []
// 引入一个开关
let isFlushPending = false

export function nextTick(fn){

    return fn? Promise.resolve().then(fn) : Promise.resolve()
}

export function queueJobs(job){

    if(queue.includes(job)){

    }else{
        queue.push(job)
    }
    queueFlush()
}

function queueFlush(){
    if(isFlushPending) return
    isFlushPending = true

    nextTick(flushJobs)
    // Promise.resolve().then(()=>{
        // 这段代码可以利用上面的nextTick来执行  将下面的代码进行抽离
    // })
}

function flushJobs(){
    isFlushPending = false  // 重置开关
    let job 
    while (job = queue.shift()) {
        job && job()
    }
}





