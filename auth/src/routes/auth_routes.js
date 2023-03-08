import { lazy } from "react" 
const Auth = lazy(() => import("@/pages/auth"));
var AuthRoutes = [
    { path: '/auth/:method?/:id?', name: 'auth', component: Auth },
    { path: '/',  component: Auth }
];
export default AuthRoutes;