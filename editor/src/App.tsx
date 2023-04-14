import React, { Suspense } from "react";
import { Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import webapi from "./utils/webapi";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import Loading from "./components/loading/loading";
import { lazy } from "react";
import "./App.css";
const Security = lazy(() => import("./layouts/security"));
const History = createBrowserHistory({ basename: "/" });
type State = {
  is_auth: boolean;
  server: Server.Server;
};
class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      is_auth: this.get_is_auth(),
      server: {
        ucdata: {},
        columns: [],
        menus: [],
        apps: [],
        loading: false,
        code: 0,
        version: "",
      },
    };
    this.server();
  }
  componentWillMount() {
    webapi.store.subscribe(() => {
      const d = webapi.store.getState();
      this.setState({
        server: d.server,
      });
      // console.log("props=>", d);
    });
  }
  /*--------------------------------------------------------------------------------
    *  get_is_auth 
  --------------------------------------------------------------------------------*/

  get_is_auth() {
    return window.location.pathname.indexOf("/auth") === -1
      ? false
      : true;
  }
  /*--------------------------------------------------------------------------------
    *  server 
  --------------------------------------------------------------------------------*/
  async server() {
    if (process.env.NODE_ENV === "development") {
      require("./test.js");
    } else {
      webapi.init_store();
    }

    const params = webapi.utils.query();
    // params.test && webapi.cache.set("test", params.test);
    webapi.server();
    webapi.customizer.launch();
  }
  render() {
    const state = this.state;
    // console.log("data=>", Routes, state);
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={webapi.store}>
          {state.server.loading ? <Loading /> : <></>}
          {state.server.code === 10000 || state.is_auth ? (

            <Suspense fallback={<Loading />}>
              <Router history={History}>
                <Switch>
                  <Security history={History} />
                </Switch>
              </Router>
            </Suspense>

          ) : (
            <Loading />
          )}
        </Provider>
      </ConfigProvider>
    );
  }
}
export default App;
