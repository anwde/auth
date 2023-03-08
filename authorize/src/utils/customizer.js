import store from "@/redux/store";
import request from "./request";
async function apps (reset=false){ 
  let res = await request.get("server/apps", {
    reset: reset,
    cache: true,
    data:{ }
  });
  if (res.code === 10000) {
    store.dispatch({ type: "APPS", data: res.lists });
    return res.data;
  }
  return {};
}
function launch() { 
  apps();
}
const i={
  apps,
  launch
};
export default i;