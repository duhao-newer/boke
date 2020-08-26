$(function () {
    $("#link_reg").click(function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").click(function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })
    let form = layui.form;
    let layer = layui.layer;
    //校验密码，采用layui的内嵌封装
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            if ($(".reg-box [name=password]").val() !== value) {
                return '两次密码不一致'
            }
        }
    })
    //检测用户名是否存在，使用axios
    $(".reg-box [name=username]").blur(function(){
        let username = $(".reg-box [name=username]").val();
        if (!username) return layer.msg("用户名不能为空");
        new Promise((resolve, reject) => {
            axios.post("http://localhost:3200/login/testRegister", {
                params: {
                    username
                }
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        }).then(res => {
            if(res.data.code !=="1")return layer.msg(res.data.msg);
            layer.msg(res.data.msg);
            // $("#test").html(res.data.msg);
        }, reason => {
            console.log(reason);
        })
    })
    //注册功能,使用axios
    $("#form_reg").submit(function (e) {
        e.preventDefault(); 
        // //使用jquery的后代选择器
        let username = $(".reg-box [name=username]").val();
        let password = $(".reg-box [name=password]").val();
        new Promise((resolve, reject) => {
            axios.post("http://localhost:3200/login/register", {
                params: {
                    username,
                    password,
                }
            }).then(res => { 
                resolve(res); 
            }).catch(err => { 
                reject(err); 
            })
        }).then(result => {
            if (result.data.code !== 0) return layer.msg(result.data.msg);
            layer.msg(result.data.msg);
            //模拟点击事件
            $("#link_login").click();
        }, reason => {
            console.log(reason);
        })
    })
    //登录功能,使用ajax
    $("#form_login").submit(function (e) {
        e.preventDefault();
        let username = $(".login-box [name=username]").val();
        let password = $(".login-box [name=password]").val();
        new Promise((resolve, reject) => {
            $.ajax({
                url: "/login/up",
                data: {
                    username,
                    password,
                },
                dataType: 'json',
                type: "post",
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            })
        }).then(res => {
            if (res.code == "0") return layer.msg(res.msg);
            if (res.code == "-1") return layer.msg(res.msg);
            layer.msg(res.msg);
            window.localStorage.setItem('details', res.token);
            location.href = "index.html";
        }, reason => {
            console.log(reason);
        })
    })
})