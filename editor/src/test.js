import webapi from "@/utils/webapi";
window.logo_icon = "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg";
window.logo_text = "http://127.0.0.1/ample-admin/ample-admin-bt4/assets/images/logos/logo-text.png";

window.appid = "2";
window.cs = "1gaxf5h2omuws2jbdu6a3vqh2t6pvpr3";
window.wu = "authorize.youyan.cc";

window.appid = "4";
window.cs = "lakhdlmiefhrv1wa1eaw1oykcldkounr";
window.wu = "manager.com";

// d['browser_test_no_encrypt']='qw12@!';
//壁纸权限
// window.appid = "356";
// window.cs = "ti33blirbs2eozxrnwhif4s6frlkyzml";
// window.wu = "authorize.hxdrive.net"; 

// webapi.store.dispatch({ type: "STORE", data: w });
webapi.store.dispatch({ type: "INITIALIZE",data:{},reducers:'SETTINGS' });
webapi.request.get("auth/id", {data:{
  id: 8,
  btne:'uf1cen1'
}}); 