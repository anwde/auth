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

declare module "*.module.scss" {
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

// @ts-ignore
/* eslint-disable */

declare namespace  Ddata { 
  const content: { [key: Number]: {id: Number; name: String  } };
  export default content;
}
declare namespace Server {
  type Breadcrumb = {
    title?: string;
    lists?: [{onClick?:Function,url?:String,title:String}];
    buttons?: [{onClick?:Function,url?:String,title:String}];
  };
  type data = { [key: Number]: {id: Number; name: String  } };
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
    breadcrumb?:Breadcrumb,
    customer?:{}
    applications?:{}
    apps:[]
  };
  type Props={
    server?:Server;
  };
  type Query = {
    order_field?: string;
    order_value?: string;
    row_count?: number;
    offset?: number;
    q?: string;
    filters?: object;
    customerappid?: string;
  };
  type Menus = {
    id: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    url?: string;
    name?: string;
    intro?: string;
    icon?: string;
    style?: string;
    group_id?: number;
    parent_id?: number;
    idx?: number;
    update_time?: number;
    create_time?: number;
  };

  type Menus_group = {
    id: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    name?: string;
    allow?: string;
    visibility?: number;
    update_time?: number;
    create_time?: number;
  };
  type Competence = {
    id: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    name?: string;
    permission?: [];
    menus?: [];
    columns?: [];
    total?: number;
    state?: number;
    update_time?: number;
    create_time?: number;
  };
  type Competence_user = Ucdata&{
    id: number;
    state_delete?: number;
    competence_id?: number;
    user_id?: number;
    update_time?: number;
    create_time?: number;
  };

  type Permission = {
    id: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    url?: string;
    name?: string;
    group_id?: number;
    parent_id?: number;
    update_time?: number;
    create_time?: number;
  };

  type Permission_group = {
    id: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    name?: string;
    allow?: string;
    visibility?: number;
    update_time?: number;
    create_time?: number;
  };
  type Columns = {
    id: number;
    columns_id?: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    module_id?: number;
    type?: number;
    model_id?: number;
    group_id?: number;
    parent_id?: number;
    parent_id_all?: string;
    child_id_all?: string;
    childmap?: number;
    name?: string;
    style?: string;
    image?: any;
    intro?: string;
    icon?: string;
    description?: string;
    keywords?: string;
    parentdir?: string;
    catdir?: string;
    url?: number;
    pdurl?: number;
    template_content?: number;
    template_list?: number;
    template_category?: number;
    update_time?: number;
    create_time?: number;
  };
  type Columns_type = {
    id?: number;
  };
  type Status = {
    status: string;
    code: number;
    message: string;
  };
  type Templates = {
    id?: number;
    templates_id?: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    name?: string;
    file?: string;
    type?: number;
    data?: string;
    update_time?: number;
    create_time?: number;
  };
  type Model = {
    id?: number;
    model_id?: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    name?: string;
    intro?: string;
    tablename?: string;
    items?: number;
    enablesearch?: number;
    disabled?: number;
    update_time?: number;
    create_time?: number;
  };
  type Model_field = {
    id?: number;
    model_id?: number;
    model_field?: number;
    customer_id?: number;
    client_id?: number;
    state_delete?: number;
    name?: string;
    field?: string;
    tips?: string;
    css?: string;
    minlength?: string;
    maxlength?: string;
    constraint?: string;
    pattern?: string;
    errortips?: string;
    formtype?: string;
    setting?: string;
    formattribute?: string;
    unsetgroupids?: string;
    unsetroleids?: string;
    is_system?: string;
    is_unique?: string;
    is_base?: string;
    is_search?: number;
    is_add?: number;
    idx?: number;
    disabled?: number;
    is_omnipotent?: number;
    is_core?: number;
    defaultvalues?: number;
    is_position?: number;
    comment?: number;
    datatype?: number;
    update_time?: number;
    create_time?: number;
  };
  type State = {
    id: number;
    data: {};
    lists: [];
    q: string;
    order_field: string;
    method: string;
    order_value: any;
    filters: any;
    pagination: {
      showSizeChanger: boolean;
      hideOnSinglePage: boolean;
      pageSize: number;
      total: number;
      current: number;
      onChange: (page: number, pageSize: number) => void;
      onShowSizeChange: (page: number, pageSize: number) => void;
    };
  };
}

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = "notification" | "message" | "event";

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
