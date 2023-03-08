import React from "react";
import Basic_Book from "./Basic_Book";
import webapi from "../../utils/webapi"; 
const BREADCRUMB = {
    title: "作品管理",
    lists: [
      {
        title: "作品管理",
        url: "/novel/books",
      },
    ],
    buttons: [
      {
        title: "创建作品",
        url: "/novel/books/add",
      },
    ],
  };
export default class Basic_Books<P = {}, S = {}, SS = any> extends Basic_Book {
    constructor(props:any) {
      super(props); 
    }
}