//  利用有限状态机来模拟正则表达式


// /abc/.test('')

function test(string){
    let startIndex 
    let endIndex
    let i
    let result = []

    function waitForA(char){
        if(char === 'a'){
            startIndex = i
            return waitForB
        }
        return waitForA
    }
    
    function waitForB(char){
        if(char === 'b'){
            return waitForC
        }
        i = i-1
        return waitForA
    }

    function waitForC(char){
        if(char === 'c'){
            endIndex = i
            return end
        }
        return waitForA
    }
    
    function end(){
        return end
    }

    let currentState = waitForA;
   for ( i = 0; i < string.length; i++) {
     let nextState = currentState(string[i])
        currentState  = nextState
        // 判断是否为结束状态
        if(currentState === end){
            console.log(startIndex,endIndex)
            result.push({
                start:startIndex,
                end:endIndex
            })
            console.log(result)
            currentState = waitForA
        }
   }
   console.log(result)
}

console.log(test('ccxaabcrhertgabcppoancabc'))