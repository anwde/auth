import {
  LOGO_BG,
  NAVBAR_BG,
  SIDEBAR_BG,
  THEME,
  DIRECTION,
  SIDEBAR_POSITION,
  HEADER_POSITION,
  LAYOUT,
  SIDEBAR_TYPE,
  CUSTOMIZER_TYPE,
  REST_STYLE_TYPE,
} from "../constants/";
import cache from "../../utils/cache";

let settings = cache.get("settings") || {}; 
const INIT_STATEd = {
  activeDir: "ltr",
  activeThemeLayout: "horizontal",
  activeTheme: "light",
  activeSidebarType: "full",
  activeNavbarBg: "skin6",
  activeSidebarBg: "skin5",
  activeSidebarPos: "fixed",
  activeHeaderPos: "fixed",
  activeLayout: "boxed",
  customizer_show: false,
};

const INIT_STATE = {
  activeDir: "ltr",
  activeThemeLayout: "vertical",
  activeTheme: "light",
  activeSidebarType: "full",
  activeLogoBg: "skin6",
  activeNavbarBg: "skin6",
  activeSidebarBg: "skin5",
  activeSidebarPos: "fixed",
  activeHeaderPos: "fixed",
  activeLayout: "full",
  customizer_show: false,
};
const defaultState = (settings) => { 
  return {
    activeDir: settings.activeDir || INIT_STATE.activeDir,
    activeThemeLayout:
      settings.activeThemeLayout || INIT_STATE.activeThemeLayout,
    activeTheme: settings.activeTheme || INIT_STATE.activeTheme,
    activeSidebarType:
      settings.activeSidebarType || INIT_STATE.activeSidebarType,
    activeLogoBg: settings.activeLogoBg || INIT_STATE.activeLogoBg,
    activeNavbarBg: settings.activeNavbarBg || INIT_STATE.activeNavbarBg,
    activeSidebarBg: settings.activeSidebarBg || INIT_STATE.activeSidebarBg,
    activeSidebarPos: settings.activeSidebarPos || INIT_STATE.activeSidebarPos,
    activeHeaderPos: settings.activeHeaderPos || INIT_STATE.activeHeaderPos,
    activeLayout: settings.activeLayout || INIT_STATE.activeLayout,
    customizer_show: settings.customizer_show || INIT_STATE.customizer_show,
  };
};

const SettingsReducer = (state = defaultState(settings), action) => {
//   console.log(cache.get("settings"), defaultState(settings), action);
  let newState = { ...state };
  let s = false;
  if (action.type === "INITIALIZE"&&action.reducers==='SETTINGS' ) {
    newState={...newState,...defaultState(cache.get("settings"))};
  }
  switch (action.type) {
    case LOGO_BG:
        s = true;
        newState.activeLogoBg = action.payload;
        break;
    case LOGO_BG:
      s = true;
      newState.activeLogoBg = action.payload;
      break;
    case NAVBAR_BG:
      s = true;
      newState.activeNavbarBg = action.payload;
      break;
    case SIDEBAR_BG:
      s = true;
      newState.activeSidebarBg = action.payload;
      break;
    case THEME:
      s = true;
      newState.activeTheme = action.payload;
      break;
    case DIRECTION:
      s = true;
      newState.activeDir = action.payload;
      break;
    case SIDEBAR_POSITION:
      s = true;
      newState.activeSidebarPos = action.payload;
      break;
    case HEADER_POSITION:
      s = true;
      newState.activeHeaderPos = action.payload;
      break;
    case LAYOUT:
      s = true;
      newState.activeLayout = action.payload;
      break;
    case SIDEBAR_TYPE:
      s = true;
      newState.activeSidebarType = action.payload;
      break;
    case CUSTOMIZER_TYPE:
      s = true;
      newState.customizer_show = action.payload;
      break;
    case REST_STYLE_TYPE:
      cache.set("settings", {});
      newState = { ...INIT_STATE };
      newState.customizer_show = true;
      break;
    default: {
    }
  }
  if (s) {
    cache.set("settings", newState);
  }
  return newState;
};

export default SettingsReducer;
