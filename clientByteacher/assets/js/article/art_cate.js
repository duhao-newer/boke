$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let indexadd,indexedit;
    findlist();
    //表单校验
    form.verify({
        alias: function (value) {
            if (/[\u4E00-\u9FA5]/g.test(value)) {
                return '分类别名不能使用汉字'
            }
        },
    })
    //添加分类弹出层
    $("#btnAddCate").click(function () {
        layui.use('layer', function () {
            indexadd = layer.open({
                type: 1,
                title: '添加分类',
                content: $("#dialog-add").html(),
            });
        });
    })
    //编辑分类弹出层
    $("body").on('click', '.btn-edit', function (e) {
        layui.use('layer', function () {
            indexedit = layer.open({
                type: 1,
                title: '编辑分类',
                content: $("#dialog-edit").html(),
            });
        });
    })
     //查询文章分类
     function findlist() {
        $.ajax({
            url: '/list/sort',
            type: 'get',
            success: function (res) {
                console.log(res.callback)
                if (res.code != "0") {
                    let htmlStr = template("tpl-table", {data:res.callback});
                    $('tbody').html(htmlStr);
                } else {
                    layer.msg(res.msg);
                }
            }
        })
    }
    //添加分类
    $("body").on('submit', '#form-add', function (e) {//动态添加的html，需要用到事件委托
        // e.preventDefault();//阻止默认事件$(this).serialize()
        let name = $("input[name='name']").val();
        let alias = $("input[name='alias']").val();
        addlist();
        function addlist() {
            $.ajax({
                url: '/list/addlist',
                data: {
                    name,
                    alias,
                },
                dataType: "json",
                type: 'post',
                success: function (res) {
                    if (res.code != "4") return layer.msg(res.msg);
                    layer.msg(res.msg);
                    findlist();
                    layer.close(indexadd);
                    // layer.closeAll();
                }
            })
        }
        return false;
    })
    //编辑的回显
    $("body").on('click', '.btn-edit', function (e) {
        let id=$(this).attr("data-id");
        $.ajax({
            url:'/list/findlistById',
            data:{id},
            type:'get',
            dataType:'json',
            success:function (res){
              if(res.code !=1) return layer.msg(res.msg);
              form.val('form-edit',res.data[0]);
            }
        })
    })
    //编辑分类
    $("body").on('submit', '#form-edit', function (e) {
        let name=$("input[name='name']").val();
        let alias=$("input[name='alias']").val();
        let id=$("input[name='id']").val();
        edit(id,name,alias);
        function edit(id,name,alias){
           $.ajax({
               url:'/list/updatelist',
               type:'post',
               data:{id,name,alias},
               dataType:'json',
               success:function(res){
                   if(res.code !=4) return layer.msg(res.msg);
                   layer.msg(res.msg);
                   findlist();
                   layer.close(indexedit);
               }
           })
        }
        return false;
    })
    //删除分类
    $("body").on('click', '.btn-delete', function (e) {
        let id=$(this).attr("data-id");
        layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url:'/list/deletelist',
                data:{id},
                dataType:'json',
                type:'get',
                success:function (res){
                   if(res.code!="1") return layer.msg(res.msg);
                   layer.msg(res.msg);
                   findlist();
                }
            })
            layer.close(index);
          });
    })
})
