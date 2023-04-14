import React from "react";
import { Route, Redirect } from "react-router-dom"; 

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // console.log('data=>111',Component);
      // const currentUser = AuthenticationService.currentUserValue;
      // if (!currentUser) {
      //   // not logged in so redirect to login page with the return url
      //   return (
      //     <Redirect
      //       to={{
      //         pathname: "/authorize/auth/login",
      //         state: { from: props.location },
      //       }}
      //     />
      //   );
      // } 
      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
