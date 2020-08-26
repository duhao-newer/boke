$(function () {
    let datas = {
        pagenum: 1,
        pagesize: 7,
        sort_id: '',
        state: '',
    }
    let layer = layui.layer;
    let laypage = layui.laypage;
    findsort();//只要不刷新本页面，只会执行一次
    findart();
    //过滤器
    template.defaults.imports.dataFormat = function (date) {
        let dt = new Date(date);
        let y = dt.getFullYear();
        let m = Zero(dt.getMonth())
        let d = Zero(dt.getDate())
        let hh = Zero(dt.getHours())
        let mm = Zero(dt.getMinutes())
        let ss = Zero(dt.getSeconds())
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
        //补0的函数
        function Zero(n) {
            return n > 9 ? n : "0" + n;
        }
    }
    //查询分类
    function findsort() {
        $.ajax({
            url: '/list/sort',
            type: 'get',
            success: function (res) {
                if (res.code != "0") {
                    let htmlStr = template("tpl-cate", { data: res.callback });
                    $('#ad').html(htmlStr);
                    layui.form.render();
                } else {
                    layer.msg(res.msg);
                }
            }
        })
    }
    //初始化查询文章
    function findart() {
        $.ajax({
            url: '/article/findart',
            data: datas,
            dataType: 'json',
            type: 'post',
            success: function (res) {
                if (res.code != 1) return layer.msg(res.msg);
                let htmlStr = template("tpl-table", { data: res.data.result });
                $("tbody").html(htmlStr);
                let total = res.data.num;
                findArticle(total);//第一次执行，只是渲染出分页面，first为true，并不执行里面的函数，
            }
        });
    }
    //分页查询文章
    function findArticle(total) {
        //总页数大于页码总数
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数
            limit:datas.pagesize,
            curr:datas.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            jump: function (obj, first) {//每次点击，都会执行jump里面的函数，
                datas.pagesize = obj.limit;
                datas.pagenum = obj.curr;
                if (!first) {
                    findart();
                }
            }
        })
    }
    //模糊
    $("#form-search").submit(function (e) {
        e.preventDefault();
        let sort_id = $("select[name='cate_id'] option:selected").val();
        let state = $("select[name='state'] option:selected").val();
        findBysort(sort_id, state);
        function findBysort(sort_id, state) {
            $.ajax({
                url: '/article/findart',
                data: {
                    sort_id,
                    state,
                    pagenum: 1,
                    pagesize: 7,
                },
                dataType: 'json',
                type: 'post',
                success: function (res) {
                    if (res.code != 1) return layer.msg(res.msg);
                    let htmlstr = template("tpl-table", { data: res.data.result });
                    $("tbody").html(htmlstr);
                    let total = res.data.num;
                }
            })
        }
    })
    //编辑文章转跳
    $("body").on('click', "#edit", function () {
        location.href = './art_pub.html';
    })
    //删除文章
    $("body").on('click', "#del", function () {
        let id = $(this).attr("data-id");
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/article/delart',
                data: { id },
                dataType: 'json',
                type: 'get',
                success: function (res) {
                    if (res.code != 1) return layer.msg(res.msg);
                    layer.msg(res.msg);
                    findArticle();
                }
            })
            layer.close(index);
        })
    })
})
