import utils from "./utils";
const get_key = function (key) {
  return "a_"+window.appid+key;
};
const clear_cookie = function (key) {
  if (key) {
    document.cookie =
      get_key(key) + "=0;expires=" + new Date(0).toUTCString();
    return document.cookie;
  }
  const keys = document.cookie.match(/[^=;]+(?==)/g);
  if (keys) {
    let i=0;
    for ( i = keys.length; i--; ) {
      document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
    }
  }
};
const clear_localStorage = function (key) {
  let storage = window.localStorage;
  if (key) {
    return storage.removeItem(get_key(key));
  }
  for (const key in storage) {
    storage.removeItem(key);
  }
};
const get = function (key) {
  let item = {
    data: false,
  };
  try {
    let t = JSON.parse(
      window.localStorage
        ? window.localStorage.getItem(get_key(key))
        : utils.getcookie(get_key(key))
    ); 
    item = t ? t : item;
  } catch (error) {
    return false;
  }
 
  if (item.expires) {
    if (Date.parse(new Date()) / 1000 - item.starttime > item.expires) {
      //缓存过期，清除缓存，返回false
      clear(key);
      return false;
    } else {
      //缓存未过期，返回值
      return item.data;
    }
  }
  return item.data;
};
const set = function (key, val, expires) {
  let options = {
    data: val,
  };
  if (expires) {
    options.expires = expires;
    options.starttime = Date.parse(new Date()) / 1000;
  }
  return window.localStorage
    ? window.localStorage.setItem(get_key(key), JSON.stringify(options))
    : utils.setcookie(get_key(key), JSON.stringify(options));
};
const clear = function (key) {
  return window.localStorage ? clear_localStorage(key) : clear_cookie(key);
};
 
const i ={
  set,
  get,
  clear,
  clear_localStorage,
  clear_cookie,
};
export default i;
