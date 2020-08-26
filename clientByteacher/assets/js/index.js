$(function () {
    let layer = layui.layer;
    getUserInfo();
    //退出登录
    $("#btnLogout").click(function () {
        layer.confirm('确定要退出吗？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('details');
            location.href = './login.html';
            layer.close(index);
        })
    })
})
  //获取用户信息
  function getUserInfo() {
    $.ajax({
        url: '/users/finduser',
        type: 'get',
        dataType: 'json',
        success: function (res) {
            if (res.code !== 1) return layer.msg("获取信息失败");
            renderAvatar(res.msg);
        },
    })
}
  //渲染头像
  function renderAvatar(user) {
    let name = user.nickname || user.username;
    $("#welcome").html("欢迎" + name);
    if (user.user_into !== null) {
        $(".text-avatar").hide();
        $(".layui-nav-img").attr('src', user.user_into).show();
    } else {
        $(".text-avatar").html(name[0].toUpperCase()).show();
        $(".layui-nav-img").hide();
    }
}