export function formatTime(time,fmt){
    //正则替代，将日期替代为正确格式
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1,(time.getFullYear() +'').substr(4-RegExp.$1.length))
    }
    let o ={
        'M+':time.getMonth()+1,
        'd+':time.getDate(),
        'h+':time.getHours(),
        'm+':time.getMinutes()
    }
    for (let k in o){
        if (new RegExp(`(${k})`).test(fmt)){
            let str=o[k]+''
            fmt = fmt.replace(RegExp.$1,(RegExp.$1.length === 1)? str:PadLeftZero(str))
        }
    }
    return fmt
}

function PadLeftZero(str){
    return ('00'+str).substr(str.length)
}
