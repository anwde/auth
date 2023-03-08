import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Loading from "@/components/loading/loading"; 
import "@/data";
const App = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./App")), 0);
    })
);
ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <BrowserRouter basename="/">
			<Route path="/" component={App}></Route>
		</BrowserRouter>
  </Suspense>, document.getElementById("container"), function() {  
	document.getElementById("container").style = "transition: all 1.5s; opacity: 1; ";
}); 
 


