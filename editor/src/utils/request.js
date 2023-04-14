import utils from "./utils";
import cache from "./cache";
import qs from "qs";
import axios from "axios";
import store from "@/redux/store";
import notify from "./notify";
const ToggleLoading = {
    type: "LOADING",
};

const get = function(url, data) {
    return http_request({
        method: "get",
        url: url,
        ...data
    });
};
const post = function(url, data) {
    return http_request({
        method: "post",
        url: url,
        ...data
    });
};
const put = function(url, data) {
    return http_request({
        method: "put",
        url: url,
        ...data
    });
};
const patch = function(url, data) {
    return http_request({
        method: "patch",
        url: url,
        ...data
    });
};
const del = function(url, data) {
    return http_request({
        method: "del",
        url: url,
        ...data
    });
};
const headers = function() {
    const data = {
        "content-type": "application/x-www-form-urlencoded",
        "client-id": window.appid,
        Accept: "application/html",
    };
    data.sn = utils.getcookie("uuid") || "";
    data.token = utils.getcookie(utils.getcookie("field")) || "";
    data.timestamp = Date.parse(new Date()) / 1000;
    data.version = "1.0";
    data.sign = utils.sign(data);
    data.format = "json";
    return data;
};
const http_request = async function(config) {
    if (typeof config === "string") {
        config = arguments[1] || {};
        config.url = arguments[0];
    } else {
        config = config || {};
    }
    const defaults = {
        method: "get",
        cache: false,
        loading: true
    };
    config = Object.assign(defaults, config);

    const options = {
        method: config.method,
        headers: headers(),
        data: config.file ? config.data : qs.stringify(config.data),
        url: (process.env.NODE_ENV === "development" ? "/" : "/") +
            (config.method === "get" ?
                config.url + "?" + qs.stringify(config.data) :
                config.url),
    };

    try {
        let hash = utils.md5(options.url);
        let josn = null;
        const href = window.location.href;
        if (config.cache) {
            let data = cache.get(hash);
            if (data) {
                josn = JSON.parse(utils.decrypt(data, window.cs, hash.substr(8, 16))) || {};
            }
        }
        if (!josn) {
            //   console.log(options.url, arguments);
            if (config.loading) {
                ToggleLoading.state = true;
                store.dispatch(ToggleLoading);
            }
            let res = await axios(options);
            if (config.loading) {
                ToggleLoading.state = false;
                store.dispatch(ToggleLoading);
            }
            josn = JSON.parse(
                utils.decrypt(
                    res.data,
                    window.cs,
                    utils.md5(res.headers["content-encrypt"]).substr(8, 16)
                )
            ) || {};
            if (
                    cache.get("test") === "development" ||
                    process.env.NODE_ENV === "development"
            ) {
                console.log(
                    "encrypt=>",
                    window.cs,
                    utils.md5(res.headers["content-encrypt"]).substr(8, 16)
                );
                console.log(config.url + " data=>", josn);
                console.log(config.url + " request=>", res);
                console.log("env=>", process.env);
            }
            if (config.cache && josn.code === 10000) {
                cache.set(
                    hash,
                    utils.encrypt(JSON.stringify(josn), window.cs, hash.substr(8, 16)),
                    60 * 60 * 5
                );
            }
        }
        if (josn.code === 10005) {
            notify.error({
                message: "通知",
                description: `${josn.message}`,
            });
        }
        if (josn.code === 11003) {
            if (
                    !(
                    href.indexOf("server/check") > 0 ||
                    href.indexOf("auth/again") > 0 ||
                    href.indexOf("auth/check") > 0
                    )
            ) {
                utils.redirect(josn);
            }
        }
        if (josn.code === 11002) {
            josn.redirect = josn.redirect || "/auth";
            let r = href.indexOf("/auth/") === -1;
            if (window.authentications) {
                window.authentications.map((val) => {
                    if (href.indexOf(val) !== -1) {
                        r = false;
                    }
                    return r;
                });
            }
            if (r) {
                utils.redirect(josn);
            }
        }
        if (config.success) {
            return config.success(josn);
        }
        return josn;
    } catch ( err ) {
        ToggleLoading.state = false;
        store.dispatch(ToggleLoading);
        console.error(err.message, options);
        const res = {
            message: err.message,
            status: "failure",
        };
        if (config.error) {
            return config.error(res);
        }
        return res;
    }
};

const i = {
    get,
    post,
    patch,
    put,
    delete: del,
    header: headers,
};
export default i;