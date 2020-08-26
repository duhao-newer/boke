$(function () {
    //设置cropper的各种参数
    let options={
        aspectRatio: 16/12,
        preview: '.img-preview'
    }
    $("#image").cropper(options)
    $("#btnChooseImage").click(function () {
        $("#file").click();
    })
    $("#file").change(function (e) {
        if (e.target.files == 0) return layui.layer.msg("请选择一张图片");
        $("#image").cropper("destroy").attr("src", URL.createObjectURL(e.target.files[0])).cropper(options);
    })
    $("#btnUpload").click(function(){
        let dataurl=$("#image").cropper("getCroppedCanvas",{
            width:100,
            height:100,
        }).toDataURL("img/png");
        $.ajax({
            url:'/users/updateavatar',
            type:'post',
            data:{user_into:dataurl},
            dataType:'json',
            success:function(res){
                if(res.code !=1) return  layui.layer.msg(res.msg);
                layui.layer.msg(res.msg);
                window.parent.getUserInfo();
            }
        })
    })

})