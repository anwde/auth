import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/loading/loading";
const Auth = lazy(() => import("../pages/authorize/auth")); 
const Layout = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Auth match={{ params: { ...useParams() } }} />
    </React.Suspense>
  );
};
export default Layout;
