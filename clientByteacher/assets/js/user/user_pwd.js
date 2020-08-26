$(function () {
    let layer = layui.layer;
    let form = layui.form;
    //修改用户密码
    //此功能建议用表单提交，因为可以使用layui的表单校验功能
    $(".layui-form").submit(function (e) {
        e.preventDefault();//阻止默认事件
        let oldpwd = $("input[name='oldPwd']").val();
        let newpwd = $("input[name='newPwd']").val();
        updateUserPwd(oldpwd, newpwd);
        function updateUserPwd(oldpwd, newpwd) {
            $.ajax({
                url: '/users/updatepwd',
                type: 'post',
                data: { oldpwd, newpwd },
                dataType: 'json',
                success: function (res) {
                    layer.msg(res.msg);
                }
            })
        }
    })
    //校验，已完成
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if ($(" input[name='oldPwd']").val() == value) {
                return '密码与原密码相同'
            }
        },
        rePwd: function (value) {
            if ($(" input[name='newPwd']").val() !== value) {
                return '确认密码与新密码不一致'
            }
        }
    })
})