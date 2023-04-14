import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
  ,
  document.getElementById("container")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// typescript忽略类型检查
// 单行忽略(添加到特定行的行前来忽略这一行的错误)
// // @ts-ignore

// 跳过对某些文件的检查 (添加到该文件的首行才起作用)
// // @ts-nocheck

// 对某些文件的检查
// // @ts-check
