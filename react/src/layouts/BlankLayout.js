import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import auth_routes from "../routes/auth_routes.js";

const BlankLayout = () => {
  return (
   
      <Switch>
        {auth_routes.map((prop, key) => {
          if (prop.redirect)
            return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        })}
      </Switch>
    
  );
};
export default BlankLayout;
