import React from "react";
import { Route } from "react-router-dom"; 

export const PrivateRoute = ({ component: Component, ...rest }) =>{
  // console.log(rest);
return (
  <Route
    {...rest}
    render={(props) => { 
      return <Component {...props} />;
    }}
  />
);
} 

export default PrivateRoute;
