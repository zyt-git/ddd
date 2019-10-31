$(function () {
    $.ajaxSetup({
        beforeSend:function(request){
            var key = getCookie("key");
            request.setRequestHeader("x-auth",key);
        }
    })
});

//设置cookie
function setCookie(value){
    document.cookie = "key" + "=" + value;
}

//获取cookie
function getCookie(name){
    var reg = RegExp(name+'=([^;]+)');
    var arr = document.cookie.match(reg);
    if(arr){
        return unescape(arr[1]);
    }else{
        return '';
    }
}