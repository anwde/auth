import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/loading/loading";
const Auth = lazy(() => import("../pages/auth"));
const Layout = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Auth match={{params: { method: "", id: 0, ...useParams() } }} server={{loading:false}} />
    </React.Suspense>
  );
};
export default Layout;
