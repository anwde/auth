import cache from "./cache";
import request from "./request";
import utils from "./utils";
import modal from "./modal";
import message from "./message";
import notify from "./notify";
import jsonp from "./jsonp";
import store from "@/redux/store";
import customizer from "./customizer";
const confirm = function (options = {}) {
  modal.confirm({
    title: options.title || "提示",
    content: options.content || "删除后数据不可恢复，确认删除吗?",
    okText: options.okText || "确认操作",
    cancelText: options.cancelText || "不要操作",
    autoFocusButton: "cancel",
    onOk() {
      return new Promise((resolve, reject) => {
        let r = request.post(options.url, { data: options.data });
        resolve(r);
      }).then((res) => {
        options.success && options.success(res);
      });
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
async function server() {
  let data = await request.get("server/check");
  if (data.code === 10000) {
    window.ucdata = data.ucdata;
    const t = { type: "SERVER" };
    t.data = { ...data };
    store.dispatch(t); 
    customer();
    applications();
    return data;
  }
  return { code: data.code };
}
async function customer(reset = false) {
  let res = await request.get("server/customer", { reset: reset, cache: true });
  if (res.code === 10000) {
    store.dispatch({ type: "CUSTOMER", data: res.data });
    return res.data;
  }
  return {};
}

async function applications(reset = false) {
  let res = await request.get("server/applications", {
    reset: reset,
    cache: true,
  });
  if (res.code === 10000) {
    store.dispatch({ type: "APPLICATIONS", data: res.data });
    return res.data;
  }
  return {};
}

function init_store() {
  try {
    const r =
      JSON.parse(
        utils.decrypt(
          window.ssd,
          window.ssk,
          utils.md5(window.ssk).substr(8, 16)
        )
      ) || {};
    window.appid = r.appid;
    window.cs = r.secret;
    window.wu = r.uri;
    // store.dispatch({ type: "INITIALIZE", data: {}, reducers: "SETTINGS" });
    store.dispatch({ type: "STORE", data: r, reducers: "SETTINGS" });
  } catch (err) {}
}
const i = {
  cache,
  request,
  utils,
  modal,
  message,
  store,
  notify,
  jsonp,
  customizer,
  confirm,
  server,
  customer,
  applications,
  init_store,
  delete: confirm,
};
export default i;
