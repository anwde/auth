import React from "react";
import store from "@/redux/store";
function handle_abort() {
  if (window.requestlist) {
    for (const [url, cancel] of window.requestlist) {
      cancel(url);
    }
    window.requestlist.clear();
  } 
  store.dispatch({state:false,type:'LOADING'}); 
} 
const Loading = () => {
  return (
    <div className="spinner" onClick={handle_abort}>
      <div className="loading">
        <div className="arc"></div>
        <div className="txt"></div>
      </div>
    </div>
  );
};

export default Loading;
