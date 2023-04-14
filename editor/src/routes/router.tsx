import { lazy } from "react";

const Books = lazy(
  () => import("../pages/books/home")
);
const Related = lazy(
  () => import("../pages/books/related")
);
const Chapter = lazy(
  () => import("../pages/books/chapters")
);
const Materials = lazy(
  () => import("../pages/books/materials")
);
const Authorize= lazy(
  () => import("../pages/books/authorize")
); 
const Customer_Books = lazy(
  () => import("../pages/books/customer/books")
);


const Customer_Volumes = lazy(
  () => import("../pages/books/related")
);
const Customer_Categorys = lazy(
  () => import("../pages/books/related")
);
const Customer_Chapters = lazy(
  () => import("../pages/books/customer/chapters")
);
const Customer_Difference = lazy(
  () => import("../pages/books/customer/difference")
);
const Customer_Materials = lazy(
  () => import("../pages/books/customer/materials")
);


let routes: Server.Routes[] = [
  {
    path: "/books", 
    children: [
      {
        path: "/books/home/:method?/:id?", 
        component: Books,
      },
      {
        path: "/books/volumes/:method?/:id?", 
        component: Books,
      },
      {
        path: "/books/chapters/:method?/:id?", 
        component: Chapter,
      },
      {
        path: "/books/categorys/:method?/:id?", 
        component: Books,
      },
      {
        path: "/books/related/:method?/:id?", 
        component: Related,
      },
      {
        path: "/books/materials/:method?/:id?", 
        component: Materials,
      },
      {
        path: "/books/authorize/:method?/:id?", 
        component: Authorize,
      },
      
      {
        path: "/books/customer/home/:method?/:id?", 
        component: Customer_Books,
      },
      {
        path: "/books/customer/chapters/:method?/:id?", 
        component: Customer_Chapters,
      },
      {
        path: "/books/customer/categorys/:method?/:id?", 
        component: Customer_Categorys,
      },
      {
        path: "/books/customer/volumes/:method?/:id?", 
        component: Customer_Volumes,
      },
      
      {
        path: "/books/customer/difference/:method?/:id?", 
        component: Customer_Difference,
      },
      {
        path: "/books/customer/materials/:method?/:id?", 
        component: Customer_Materials,
      },
      
      
     
       
      
    ],
  },
];

export default routes;
