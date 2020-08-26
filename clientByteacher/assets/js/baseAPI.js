//ajax的请求拦截器
$.ajaxPrefilter(function (options) {
   //统一设置路径
   options.url = 'http://localhost:3200' + options.url;
   //守卫
   options.complete = function (res) {
      if (res.responseJSON.code == 1 && res.responseJSON.msg == '身份验证失败') {
         localStorage.removeItem('details');
         location.href = '../login.html';
      }
   }
   //设置token
   if (options.url.indexOf('/users/') !== -1) {
      options.headers = {
         Authorization: "Bearer" + " " + localStorage.getItem('details'),
      }
   }
   if (options.url.indexOf('/list/') !== -1) {
      options.headers = {
         Authorization: "Bearer" + " " + localStorage.getItem('details'),
      }
   }
   if (options.url.indexOf('/article/') !== -1) {
      options.headers = {
         Authorization: "Bearer" + " " + localStorage.getItem('details'),
      }
   }
})