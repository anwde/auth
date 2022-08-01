import React from "react";
import { BrowserRouter, Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import indexRoutes from "@/routes/"; 
import { createBrowserHistory } from "history";
import { PrivateRoute } from "@/routes/private_routes";
import webapi from "@/utils/webapi";
import { ConfigProvider } from "antd";
// import enUS from 'antd/lib/locale/en_US';
import zhCN from "antd/lib/locale/zh_CN";
import Loading from "@/components/loading/loading";
// console.log(11112);

const History = createBrowserHistory({ basename: "/" });
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homepage: "/",
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
  UNSAFE_componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.setState({ is_auth: this.get_is_auth() });
  }
  UNSAFE_componentWillMount() {
    webapi.store.subscribe(() => {
      const d = webapi.store.getState();
      this.setState({
        server: d.server,
      });
    });
  }
  /*--------------------------------------------------------------------------------
    *  server 
  --------------------------------------------------------------------------------*/

  get_is_auth() {
    return this.props.location.pathname.indexOf("/auth");
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
    params.test && webapi.cache.set("test", params.test);
    webapi.server();
    webapi.customizer.launch();
  }
  render() { 
    // console.log(this.state.server);
    return (
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <Provider store={webapi.store}>
            {this.state.server.loading ? <Loading /> : ""}
            {/* {this.state.server.code===10000||this.state.is_auth === 0 ? ( */} 
            <Router history={History}>
              <Switch>
                {indexRoutes.map((prop, key) => {
                  return ( 
                    <PrivateRoute
                      path={prop.path}
                      key={key}
                      component={prop.component}
                    />
                  );
                })}
              </Switch>
            </Router>
            {/* ):<Loading /> } */}
          </Provider>
        </BrowserRouter>
      </ConfigProvider>
    );
  }
}
export default App;
