import { notification } from "antd"; 
const open = function(options = {}) {
    return notification.open(options);
};
const info = function(options = {}) {
    return notification.info(options);
};
const success = function(options = {}) {
    return notification.success(options);
};
const warn = function(options = {}) {
    return notification.warn(options);
};
const error = function(options = {}) {
    return notification.error(options);
};
const warning = function(options = {}) {
    return notification.warning(options);
};
const close = function(options) {
    return notification.close(options);
};
const destroy = function(options) {
    return notification.destroy(options);
};

const i={
    open,
    info,
    success,
    warn,
    error,
    warning,
    close,
    destroy,
};
export default  i;