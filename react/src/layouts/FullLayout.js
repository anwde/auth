import React, { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Header from "@/layouts/components/header/header";
import Sidebar from "@/layouts/components/sidebar/sidebar";
import Footer from "@/layouts/components/footer/footer";
import Customizer from "@/layouts/components/customizer/customizer";
import ThemeRoutes from "@/routes/router";
import Loading from "@/components/loading/loading";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

// console.log('data=>',ThemeRoutes)
const FullLayout = (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    const updateDimensions = () => {
      let element = document.getElementById("main-wrapper");
      setWidth(window.innerWidth);
      switch (settings.activeSidebarType) {
        case "full":
        case "iconbar":
          if (width < 1170) {
            element.setAttribute("data-sidebartype", "mini-sidebar");
            element.classList.add("mini-sidebar");
          } else {
            element.setAttribute(
              "data-sidebartype",
              settings.activeSidebarType
            );
            element.classList.remove("mini-sidebar");
          }
          break;

        case "overlay":
          if (width < 767) {
            element.setAttribute("data-sidebartype", "mini-sidebar");
          } else {
            element.setAttribute(
              "data-sidebartype",
              settings.activeSidebarType
            );
          }
          break;

        default:
      }
    };
    if (document.readyState === "complete") {
      updateDimensions();
    }
    window.addEventListener("load", updateDimensions.bind(null));
    window.addEventListener("resize", updateDimensions.bind(null));
    return () => {
      window.removeEventListener("load", updateDimensions.bind(null));
      window.removeEventListener("resize", updateDimensions.bind(null));
    };
  }, [settings.activeSidebarType, width]);

  return (
    <div
      id="main-wrapper"
      dir={settings.activeDir}
      data-theme={settings.activeTheme}
      data-layout={settings.activeThemeLayout}
      data-sidebartype={settings.activeSidebarType}
      data-sidebar-position={settings.activeSidebarPos}
      data-header-position={settings.activeHeaderPos}
      data-boxed-layout={settings.activeLayout}
    >
      {/*--------------------------------------------------------------------------------*/}
      {/* Header                                                                         */}
      {/*--------------------------------------------------------------------------------*/}
      <Header {...props} />
      <div className="page-container">
        {/*--------------------------------------------------------------------------------*/}
        {/* Sidebar                                                                        */}
        {/*--------------------------------------------------------------------------------*/}
        <Sidebar {...props} />
        {/*--------------------------------------------------------------------------------*/}
        {/* Page Main-Content                                                              */}
        {/*--------------------------------------------------------------------------------*/}
        <div className="page-wrapper d-block">
          <Breadcrumb {...props} />
          <div
            className="page-content container-fluid" 
          >
            <Suspense fallback={<Loading />}>
              <Switch>
                {ThemeRoutes.map((prop, key) => {
                  if (prop.navlabel) {
                    return null;
                  } else if (prop.collapse) {
                    return prop.child.map((prop2, key2) => {
                      if (prop2.collapse) {
                        return prop2.subchild.map((prop3, key3) => {
                          return (
                            <Route
                              path={prop3.path}
                              component={prop3.component}
                              key={key3}
                            />
                          );
                        });
                      }
                      return (
                        <Route
                          path={prop2.path}
                          component={prop2.component}
                          key={key2}
                        />
                      );
                    });
                  } else if (prop.redirect) {
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  } else {
                    return (
                      <Route
                        path={prop.path}
                        component={prop.component}
                        key={key}
                      />
                    );
                  }
                })}
              </Switch>
            </Suspense>
          </div>
          
        </div>
        <Footer />
        {/*--------------------------------------------------------------------------------*/}
        {/* Customizer from which you can set all the Layout Settings                      */}
        {/*--------------------------------------------------------------------------------*/}
        <Customizer />
      </div>
    </div>
  );
};

export default FullLayout;
