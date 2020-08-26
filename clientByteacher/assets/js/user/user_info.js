$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initUserInfo();
    //回显用户信息
    function initUserInfo() {
        $.ajax({
            url: '/users/finduser',
            type: 'get',
            success: function (res) {
                if (res.code !== 1) return layer.msg('获取用户信息失败');
                form.val('formUserInfo', res.msg);
            }
        })
    }
    //重置按钮
    $("#btnReset").click(function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //提交表单
    $(".layui-form").submit(function (e) {
        e.preventDefault();
        let nickname = $("input[name='nickname']").val();
        let email = $("input[name=email]").val();
        new Promise((resolve, reject) => {
            $.ajax({
                url: "/users/updateuser",
                data: {
                    nickname,
                    email,
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
            layer.msg(res.msg);
            window.parent.getUserInfo();
        }, reason => {
            console.log(reason);
        })
    })
})