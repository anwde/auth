import { Modal } from "antd";  
const info = function(options) {
    return Modal.info(options);
};
const success = function(options) {
    return Modal.succeed(options);
};
const show = function(options) {
    return Modal.show(options);
};
const error = function(options) {
    // console.log('=>', options);
    return Modal.failed(options);
};
const confirm = function(options) {
    return Modal.confirm(options);
};
const warning = function(options) {
    return Modal.failed(options);
};
const i={
    info: info,
    success: success,
    error: error,
    confirm: confirm,
    show: show,
    warning,
    modal: Modal,
}
export default i;