import { lazy } from "react";
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const BlankLayout = lazy(() => import("../layouts/BlankLayout.js"));

var indexRoutes = [
  { path: "/auth/", component: BlankLayout },
  { path: "/", component: BlankLayout },
];

export default indexRoutes;
