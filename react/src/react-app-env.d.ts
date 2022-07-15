/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}

// declare global {
//   interface Window {
//     ssd:string;
//     ssk:string;
//     appid:string;
//     cs:string,
//     wu:string,
//     ucdata:Server.Ucdata;
//   }
// }
// declare const window: Window & { ucdata: any };
declare namespace Server {
  type Breadcrumb = {
    title?: string;
    lists?: [{ onClick: ""; url: ""; title: "" }];
    buttons?: [{ onClick: ""; url: ""; title: "" }];
  };

  type Routes = {
    path: string;
    component?: React.LazyExoticComponent;
    //Component: React.LazyExoticComponent<React.FunctionComponent>
    children?: Routes[];
  };
  type Ucdata = {
    user_id?: number;
    avatar?: string;
    nickname?: string;
    mobile?: string;
    customer_id?: number;
    client_id?: number;
  };
  type Server = {
    is_auth?: Boolean;
    ucdata?: Ucdata;
    columns?: [];
    menus?: [];
    loading?: Boolean;
    code?: number;
    version?: string;
    breadcrumb?: Breadcrumb;
  };
  type Props = {
    server?: Server;
    match: {
      params: { method: string; id: string | number };
    };
    history?: {
      replace: (url: string) => {};
    };
  };
   type Pagination = {
    showSizeChanger: boolean;
    hideOnSinglePage: boolean;
    pageSize: number;
    total: number;
    current: number;
    onChange: (page: number, pageSize: number) => void;
    onShowSizeChange: (page: number, pageSize: number) => void;
  };
  type State = {
    id?: string | number;
    data?: {};
    // lists: [];
    query_q?:string;
    q?: string;
    order_field?: string;
    method?: string;
    order_value?: any;
    filters?: any;
    pagination?:Pagination;
  };
  type Status = {
    status: string;
    code: number;
    message: string;
  };
}
