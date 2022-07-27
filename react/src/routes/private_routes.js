import React from "react";
import { Route, Redirect } from "react-router-dom"; 

export const PrivateRoute = ({ component: Component, ...rest }) =>{
  // console.log(rest);
return (
  <Route
    {...rest}
    render={(props) => {
      console.log('data=>111',props);
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

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);
} 

export default PrivateRoute;
