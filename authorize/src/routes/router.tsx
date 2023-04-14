import { lazy } from "react";
const Account = lazy(() => import("../pages/account"));
const Columns = lazy(() => import("../pages/columns"));
const Menus = lazy(() => import("../pages/menus"));
const Competence = lazy(() => import("../pages/competence"));
const Permission = lazy(() => import("../pages/permission"));
const Customer = lazy(() => import("../pages/customer/customer"));
const Customer_applications = lazy(
  () => import("../pages/customer/applications")
);
const Customer_applications_channel = lazy(
  () => import("../pages/customer/applications_channel")
);
const Customer_applications_extend = lazy(
  () => import("../pages/customer/applications_extend")
);
const Customer_applications_extend_items = lazy(
  () => import("../pages/customer/applications_extend_items")
);
const Customer_applications_spm_page = lazy(
  () => import("../pages/customer/applications/spm/page")
);
const Customer_applications_spm_module = lazy(
  () => import("../pages/customer/applications/spm/module")
);
const Customer_applications_spm_area = lazy(
  () => import("../pages/customer/applications/spm/area")
);

const Customer_competence_user = lazy(
  () => import("../pages/customer/competence_user")
);

const Books = lazy(
  () => import("../pages/books/books")
);

let routes: Server.Routes[] = [
  {
    path: "/authorize/account",
    component: Account,
    children: [
      {
        path: "/authorize/account/:method",
        children: [{ path: "/authorize/account/:method/:id" }],
      },
    ],
  },
  {
    path: "/columns",
    component: Columns,
    children: [
      {
        path: "/columns/:method",
        children: [{ path: "/columns/:method/:id" }],
      },
    ],
  },
  {
    path: "/competence",
    component: Competence,
    children: [
      {
        path: "/competence/:method",

        children: [{ path: "/competence/:method/:id" }],
      },
    ],
  },
  {
    path: "/permission",
    component: Permission,
    children: [
      {
        path: "/permission/:method",

        children: [{ path: "/permission/:method/:id" }],
      },
    ],
  },
  {
    path: "/menus",
    component: Menus,
    children: [
      {
        path: "/menus/:method",

        children: [{ path: "/menus/:method/:id" }],
      },
    ],
  },

  {
    path: "/customer",
    component: Customer,
    children: [
      {
        path: "/customer/applications",
        component: Customer_applications,
        children: [
          
          {
            path: "/customer/applications/spm/page/:method/",
            component: Customer_applications_spm_page,
            children: [
              {
                path: "/customer/applications/spm/page/:method/:id"
              },
            ]
          },
          {
            path: "/customer/applications/spm/module/:method/",
            component: Customer_applications_spm_module,
            children: [
              {
                path: "/customer/applications/spm/module/:method/:id"
              },
            ]
          },
          {
            path: "/customer/applications/spm/area/:method/",
            component: Customer_applications_spm_area,
            children: [
              {
                path: "/customer/applications/spm/area/:method/:id"
              },
            ]
          },
          {
            path: "/customer/applications/:method",
            children: [
              { path: "/customer/applications/:method/:id" },
            ],
          },
        ],
      },
      {
        path: "/customer/applications_channel/:method",
        component: Customer_applications_channel,
        children: [
          { path: "/customer/applications_channel/:method/:id" },
        ],
      },

      {
        path: "/customer/applications_extend/:method/:applications_id",
        component: Customer_applications_extend,
        children: [
          {
            path: "/customer/applications_extend/:method/:applications_id/:id",
          },
        ],
      },
      {
        path: "/customer/applications_extend_items/:method/:extend_id",
        component: Customer_applications_extend_items,
        children: [
          {
            path: "/customer/applications_extend_items/:method/:extend_id/:id",
          },
        ],
      },
      {
        path: "/customer/competence_user/:method",
        component: Customer_competence_user,
        children: [{ path: "/customer/competence_user/:method/:id" }],
      },
      {
        path: "/customer/:method?/:id?",
        component: Customer,
      },
    ],
  },
  {
    path: "/books",
    component: Books,
    children: [
      {
        path: "/books/books/:method/:id",
        component: Books,
        children: [
          {
            path: "/books/volume/:method/:book_id/:id?",
            component: Books,
          },
          {
            path: "/books/chapter/:method/:book_id/:id?",
            component: Books,
          },
        ],
      },

    ],
  },
];

export default routes;
