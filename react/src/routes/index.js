import { lazy } from "react";
const BlankLayout = lazy(() => import("../layouts/BlankLayout.js"));

const indexRoutes = [
  { path: "/auth/", component: BlankLayout },
  { path: "/", component: BlankLayout },
];

export default indexRoutes;
