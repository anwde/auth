import { lazy } from "react";
const Auth = lazy(() => import("../layouts/auth"));
const Security = lazy(() => import("../layouts/security"));

var indexRoutes = [
  { path: "/authorize/auth/", name: "authorize", component: Auth },
  { path: "/", name: "FullLayout", component: Security },
];

export default indexRoutes;
