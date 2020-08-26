$(function(){
    findlist();
    //初始化富文本框
    initEditor();
    //设置cropper的参数
    let option={
        aspectRatio:400/200,
        preview:'.img-preview'
    }
    $("#image").cropper(option);
    //绑定事件
    $("#btnChooseImage").click(function(){
        $("#coverFile").click();
    })
    //触发事件
    $("#coverFile").change(function(e){
        if (e.target.files == 0) return layui.layer.msg("请选择一张图片");
        $("#image").cropper('destroy').attr("src",URL.createObjectURL(e.target.files[0])).cropper(option);
    })
    //获取分类列表
    function findlist(){
       $.ajax({
           url:'/list/sort',
           type:'get',
           success:function(res){
               if( res.code ===0) return layui.layer.msg(res.msg);
               let htmlstr=template('tpl-cate',{data:res.callback});
               $("select[name='sort_id']").html(htmlstr);
               layui.form.render();
           }
       })
    }
    //提交数据
    $("#form-pub").submit(function(e){
         e.preventDefault();
         let state='已发布';
         //创建一个formatdata
         let fd=new FormData($(this)[0]);
         fd.append("state",state);
         $("#image").cropper("getCroppedCanvas",{
             width:400,
             height:200,
         }).toBlob(function(blob){//异步代码
             fd.append('cover_img',blob);
             $.ajax({
                 url:'/article/addart',
                 data:fd,
                 dataType:'json',
                 type:'post',
                 contentType:false,
                 processData:false,
                 success:function(res){
                     if(res.code==0)return layui.layer.msg(res.msg);
                     layui.layer.msg(res.msg);
                     window.location.href='./art_list.html';
                 }
             })
         })

    })
})