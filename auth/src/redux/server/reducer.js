const defaultState = {
  ucdata: {},
  columns: [],
  columns_active: { expand: {}, selected: 0 },
  menus: [],
  menus_active: { expand: {}, selected: 0 },
  customer: {},
  applications: {},
  breadcrumb: { lists: [], buttons: [] },
  loading: false,
  code: 0,
  version: "",
};
const reducer = (state = defaultState, action) => {
  let newState = { ...state };
  if (action.type === "LOADING") {
    newState.loading = action.state;
  }
  if (action.type === "SERVER") {
    newState.ucdata = action.data.ucdata;
    newState.columns = action.data.columns;
    newState.menus = action.data.menus;
    newState.code = action.data.code * 1;
    newState.version = action.data.version + "";
  }
  if (action.type === "STORE") {
    newState.appid = action.data.appid;
    newState.secret = action.data.secret;
    newState.uri = action.data.uri; 
  } 
  if (action.type === "BREADCRUMB") {
    newState.breadcrumb = action.data;
  }
  if (action.type === "SIDEBAR") {
    newState.columns = action.data;
  }
  if (action.type === "SIDEBARACTIVE") {
    newState.columns_active = { ...newState.columns_active, ...action.data };
  }
  if (action.type === "CUSTOMER") {
    newState.customer = { ...newState.customer, ...action.data };
  }
  if (action.type === "APPLICATIONS") {
    newState.applications = { ...newState.applications, ...action.data };
  }
  return newState;
};
export default reducer;
