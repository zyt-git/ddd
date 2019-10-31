var loginFlag=false;
var shortage;
$(function () {
    var v_html='<nav class="navbar navbar-inverse">\n' +
        '    <div class="container-fluid">\n' +
        '        <div class="navbar-header">\n' +
        '            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"\n' +
        '                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">\n' +
        '                <span class="sr-only">Toggle navigation</span>\n' +
        '                <span class="icon-bar"></span>\n' +
        '                <span class="icon-bar"></span>\n' +
        '                <span class="icon-bar"></span>\n' +
        '            </button>\n' +
        '            <a class="navbar-brand" href="#">飞狐电商</a>\n' +
        '        </div>\n' +
        '\n' +
        '        <!-- Collect the nav links, forms, and other content for toggling -->\n' +
        '        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n' +
        '            <ul class="nav navbar-nav">\n' +
        '\n' +
        '            </ul>\n' +
        '            </li>\n' +
        '            </ul>\n' +
        '            <ul class="nav navbar-nav navbar-right">\n' +
        '                <li class="dropdown">\n' +
        '                    <a href="#" id="memberNameLi"></a>\n' +
        '                </li>\n' +
        '                <li class="dropdown" id="login">\n' +
        '\n' +
        '                </li>\n' +
        '                <li class="dropdown">\n' +
        '                    <a href="login.html">登录</a>\n' +
        '                </li>\n' +
        '                <li class="dropdown" >\n' +
        '                    <a href="register.html">注册</a>\n' +
        '                </li>\n' +
        '                <li class="dropdown" >\n' +
        '                </li>\n' +
        '\n' +
        '            </ul>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</nav>';

    $("#nav").html(v_html);



    $.ajaxSetup({
        beforeSend:function(request){
            var value=$.cookie("x-auth");
            request.setRequestHeader("x-auth",value);
        }
    })




    $.ajax({
        url:"http://localhost:8081/members/findMemberName",
        type:"get",
        async:false,
        success:function(result){
            if(result.code==200){
                loginFlag = true;
                $("#login").html('<a>欢迎'+ result.data +'登录</a>');
                $("#login").next().html("<a onclick='logiOut()'>退出</a><a href='cart.html'>购物车</a>");
            }
        }
    })



})

function buyShop(shopId,action,flag) {
    if(!loginFlag){
        bootbox.dialog({
            backdrop:false,
            message: "会员名：<input type='text' id='memberName'/><br>密码：<input type='password' id='password'/><br>",
            size: 'small',
            title: "提示信息",
            buttons:{
                confirm:{
                    label:'确定',
                    className:'btn-success',
                    callback:function(){
                        var  memberName=$("#memberName").val();
                        var  password=$("#password").val();
                        $.post({
                            url:"http://localhost:8081/members/login",
                            data:{"memberName":memberName,"password":password},
                            success:function (result) {
                                if(result.code==200){
                                    $.cookie("x-auth",result.data);
                                    loginFlag=true;
                                    buyShop(shopId,"add");
                                    //initCart();
                                }else{
                                    bootbox.alert({
                                        message: "<span class='glyphicon glyphicon-exclamation-sign'></span>"+result.msg,
                                        size: 'small',
                                        title: "提示信息"
                                    });
                                }
                            }
                        })

                    },
                },
                cancel:{
                    label:'取消',
                    className:'btn-danger',
                }
            },
        });
    }else{
        var count;
        if(action=="add"){
            count=1;
        }
        if(action=="reduce"){
            count=-1;
        }
        $.ajax({
            url:"http://localhost:8081/carts",
            type:"post",
            data:{"shopId":shopId,count:count},
            success:function (result) {
                if(result.code==200){
                    if(flag==1){
                        //购物车页面
                        initCart();
                    }else{
                        location.href="cart.html";
                    }

                }
            }
        })
    }

}


function logiOut() {
    $.ajax({
        url:"http://localhost:8081/members/loginOut",
        type:"get",
        beforeSend:function(request){
            var value=$.cookie("x-auth");
            console.log(value);
            request.setRequestHeader("x-auth",value);
        },
        success:function(result){
            if(result.code==200){
                $.removeCookie("x-auth");
                location.href="/";
            }
        }
    })
}












