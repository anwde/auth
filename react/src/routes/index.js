import { lazy } from "react";
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const BlankLayout = lazy(() => import("../layouts/BlankLayout.js"));

var indexRoutes = [
  { path: "/auth/", name: "authorize", component: BlankLayout },
  { path: "/", name: "FullLayout", component: FullLayout },
];

export default indexRoutes;
