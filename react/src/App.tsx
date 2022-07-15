import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Router, Outlet, Routes, Route } from "react-router-dom";
import store from "./redux/store";
import { createBrowserHistory } from "history";
import Loading from "./components/loading/loading";
const Auth = lazy(() => import("./layouts/auth"));
const History = createBrowserHistory();
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
        loading: false,
        code: 0,
        version: "",
      },
    };
    this.server();
  }
  /*--------------------------------------------------------------------------------
    *  get_is_auth 
  --------------------------------------------------------------------------------*/

  get_is_auth() {
    return window.location.pathname.indexOf("/authorize/auth") === -1
      ? false
      : true;
  }
  /*--------------------------------------------------------------------------------
    *  server 
  --------------------------------------------------------------------------------*/
  async server() {
    if (process.env.NODE_ENV === "development") {
      // require("./test.js");
    } else {
      // webapi.init_store();
    }
    // const params = webapi.utils.query();
    // params.test && webapi.cache.set("test", params.test);
    // webapi.server();
    // webapi.customizer.launch();
  }
  render() {
    const state = this.state;
    return (
      <>
        <Provider store={store}>
          {state.server.loading ? <Loading /> : <></>}
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Auth />}> 
                <Route path=":method" element={<Auth />}>
                  <Route path=":id" element={<Auth />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Provider>
      </>
    );
  }
}

export default App;
