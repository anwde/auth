import webapi from "@/utils/webapi";
window.logo_icon = "http://127.0.0.1/ample-admin/ample-admin-bt4/assets/images/logos/logo-icon.png";
window.logo_text = "http://127.0.0.1/ample-admin/ample-admin-bt4/assets/images/logos/logo-text.png";
 
window.appid = "2";
window.cs = "1gaxf5h2omuws2jbdu6a3vqh2t6pvpr3";
window.wu = "authorize.youyan.cc";

// window.appid = "313";
// window.cs = "1gaxf5h2omuws2jbdu6a3vqh2t6pvpr3";
// window.wu = "authorize.youyan.cc";

// webapi.store.dispatch({ type: "STORE", data: w });
webapi.store.dispatch({ type: "INITIALIZE",data:{},reducers:'SETTINGS' });
// webapi.request.get("authorize/auth/id", {data:{
//   id: 8,
// }}); 