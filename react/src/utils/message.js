import { message as Message } from "antd";
const show = function(options = {}) {
    Message.show(options);
};
const info = function(options = {}) {
    Message.info(options);
};
const success = function(options = {}) { 
    Message.success(options);
};
const warn = function(options = {}) {
    Message.warn(options);
};
const error = function(options = {}) {
    Message.error(options);
};
const close = function() {
    Message.close();
};
const i={
    show: show,
    info: info,
    success: success,
    warn: warn,
    error: error,
    close: close,
};
export default i;
 