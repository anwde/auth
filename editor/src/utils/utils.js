import { parse } from "./querystring";
import md5 from "md5";
import CryptoJS from "crypto-js";
import qs from "qs";
import cache from "./cache";
const in_array = function (search, array) {
  let i;
  for (i in array) {
    if (array[i] === search) {
      return true;
    }
  }
  return false;
};
const setcookie = function (
  cookieName,
  cookieValue,
  expires,
  path,
  domain,
  secure
) {
  document.cookie =
    escape(cookieName) +
    "=" +
    escape(cookieValue) +
    (expires ? "; expires=" + expires.toGMTString() : "") +
    "; path=" +
    (path ? +path : "/") +
    (domain ? "; domain=" + domain : "") +
    (secure ? "; secure" : "");
};
const getcookie = function (name) {
  let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) return unescape(arr[2]);
  return null;
};
const title = function (t) {
  document.title = t;
  let i = document.createElement("iframe");
  i.src = "/favicon.ico?v=" + Math.random();
  i.style.visibility = "hidden";
  i.style.width = "1px";
  i.style.height = "1px";
  i.onload = function () {
    setTimeout(function () {
      i.remove();
      document.title = t;
    }, 500);
  };
  return t;
};

const query = (q):{}=> parse((q ? q : window.location.search).split("?")[1]);
const http_build_query = (data) => qs.stringify(data);
const redirect = (data) => {
  if (
    process.env.NODE_ENV === "development" ||
    cache.get("test") === "development"
  ) {
    return console.log("redirect=>", data);
  }
  let url = data.redirect || "";
  let reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  let objExp = new RegExp(reg);
  if (objExp.test(url) === true) {
    window.location.replace(url);
  } else {
    window.location.replace("/" + (url || ""));
  }
};
/**
 * 加密
 * @param string word 待加密报文
 * @return string
 */
const encrypt = (word, key, iv) => {
  let d = CryptoJS.AES.encrypt(word, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return d.toString();
};

/**
 * 解密
 * @param string word 待解密报文
 * @return string
 */
const decrypt = (word, key, iv) => {
  let d = CryptoJS.AES.decrypt(word, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return d.toString(CryptoJS.enc.Utf8);
};
/**
 * 关闭窗口
 */
const close_window = () => {
  window.opener = null;
  window.open("about:blank", "_top").close();
};
// 定义一个深拷贝函数  接收目标target参数
function deepclone(target) {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === "object") {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepclone(target[i]));
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepclone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
}
function ksort(param) {
  let dic = {};
  let sdic = Object.keys(param || {}).sort();
  sdic.map((item, index) => {
    dic[item] = param[sdic[index]];
    return index;
  });
  return dic;
}
//签名
function sign(param) {
  let d = {
    client_id: window.appid,
    timestamp: param.timestamp,
    url: encodeURIComponent(window.wu || ""),
    version: param.version,
  };
  return md5(qs.stringify(ksort(d)) + encodeURIComponent(window.cs || ""));
}
/**
 * 深度判断两个对象是否相同
 */
function diff(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  } else {
    for (let key in obj1) {
      if (!obj2.hasOwnProperty(key)) {
        return false;
      }
      //类型相同
      if (typeof obj1[key] === typeof obj2[key]) {
        //同为引用类型
        if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
          const equal = diff(obj1[key], obj2[key]);
          if (!equal) {
            return false;
          }
        }
        //同为基础数据类型
        if (
          typeof obj1[key] !== "object" &&
          typeof obj2[key] !== "object" &&
          obj1[key] !== obj2[key]
        ) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}

const i = {
  diff,
  md5,
  ksort,
  sign,
  in_array,
  setcookie,
  getcookie,
  title,
  query,
  http_build_query,
  redirect,
  encrypt,
  decrypt,
  close_window,
  deepclone,
};
export default i;
