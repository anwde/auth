// @ts-nocheck
import {
  CaretDownFilled,
  DoubleRightOutlined,
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, Divider, Input, Dropdown, Popover, theme, Cascader } from 'antd';
import React, { useState, Suspense } from 'react';
import defaultProps from './_defaultProps';
import routers from "../routes/router";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import Loading from "../components/loading/loading";
import { useSelector } from "react-redux";
import AvatarDropdown from '../components/header/AvatarDropdown';
import MenusDropdown from '../components/header/MenusDropdown';
import type { MenuDataItem } from "@ant-design/pro-layout";
import Icon, * as Icons from "@ant-design/icons";
import webapi from "../utils/webapi";
const loopMenuItem = (
  columns: [],
  is_children: boolean = false
): MenuDataItem[] => {
  return columns.map(({ icon, children, name, url, id }) => {
    return {
      key: `${id}`,
      name,
      icon: icon && Icons[icon] ? <Icon component={Icons[icon]} /> : "",
      path: url,
      routes: children && loopMenuItem(children, true),
    };
  });
};
const handle_apps_change = (application_id, customer_id) => {
  // console.log(application_id, customer_id);
  webapi.utils.setcookie("customerid", customer_id);
  webapi.utils.setcookie("customerappid", application_id);
};
const Layout = (props) => {
  const { columns, breadcrumb, customer, applications, apps } = useSelector(
    (state: Server.Props) => state.server
  );
  // console.log(breadcrumb);
  const Irouters = (Server_routes: Server.Routes[]) => {
    let r = [];
    const rs = (routes: Server.Routes[], pprop: Server.Routes = { path: "" }) => {
      routes.map((prop, key) => {
        let { component, path } = prop;
        if (!component && pprop.component) {
          component = prop.component = pprop.component;
        }
        if (prop.children) {
          rs(prop.children, prop);
        }
        r.push(<Route path={path} key={path} component={component}></Route>);
      });
    };
    rs(Server_routes);
    return r;
  };
  const Item: React.FC<{ children: React.ReactNode }> = (props) => {
    const { token } = theme.useToken();
    return (
      <div
        className={css`
        color: ${token.colorTextSecondary};
        font-size: 14px;
        cursor: pointer;
        line-height: 22px;
        margin-bottom: 8px;
        &:hover {
          color: ${token.colorPrimary};
        }
      `}
        style={{
          width: '33.33%',
        }}
      >
        {props.children}
        <DoubleRightOutlined
          style={{
            marginInlineStart: 4,
          }}
        />
      </div>
    );
  };
  const List: React.FC<{ title: string; style?: React.CSSProperties }> = (props) => {
    const { token } = theme.useToken();

    return (
      <div
        style={{
          width: '100%',
          ...props.style,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: token.colorTextHeading,
            lineHeight: '24px',
            fontWeight: 500,
            marginBlockEnd: 16,
          }}
        >
          {props.title}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {new Array(6).fill(1).map((_, index) => {
            return <Item key={index}>具体的解决方案-{index}</Item>;
          })}
        </div>
      </div>
    );
  };
  const MenuCard = () => {
    const { token } = theme.useToken();
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Divider
          style={{
            height: '1.5em',
          }}
          type="vertical"
        />
        <Popover
          placement="bottom"
          overlayStyle={{
            width: 'calc(100vw - 24px)',
            padding: '24px',
            paddingTop: 8,
            height: '307px',
            borderRadius: '0 0 6px 6px',
          }}
          content={
            <div style={{ display: 'flex', padding: '32px 40px' }}>
              <div style={{ flex: 1 }}>
                <List title="金融解决方案" />
                <List
                  title="其他解决方案"
                  style={{
                    marginBlockStart: 32,
                  }}
                />
              </div>

              <div
                style={{
                  width: '308px',
                  borderInlineStart: '1px solid ' + token.colorBorder,
                  paddingInlineStart: 16,
                }}
              >
                <div
                  className={css`
                  font-size: 14px;
                  color: ${token.colorText};
                  line-height: 22px;
                `}
                >
                  热门产品
                </div>
                {new Array(3).fill(1).map((name, index) => {
                  return (
                    <div
                      key={index}
                      className={css`
                      border-radius: 4px;
                      padding: 16px;
                      margin-top: 4px;
                      display: flex;
                      cursor: pointer;
                      &:hover {
                        background-color: ${token.colorBgTextHover};
                      }
                    `}
                    >
                      <img src="https://gw.alipayobjects.com/zos/antfincdn/6FTGmLLmN/bianzu%25252013.svg" />
                      <div
                        style={{
                          marginInlineStart: 14,
                        }}
                      >
                        <div
                          className={css`
                          font-size: 14px;
                          color: ${token.colorText};
                          line-height: 22px;
                        `}
                        >
                          Ant Design
                        </div>
                        <div
                          className={css`
                          font-size: 12px;
                          color: ${token.colorTextSecondary};
                          line-height: 20px;
                        `}
                        >
                          杭州市较知名的 UI 设计语言
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }
        >
          <div
            style={{
              color: token.colorTextHeading,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              gap: 4,
              paddingInlineStart: 8,
              paddingInlineEnd: 12,
              alignItems: 'center',
            }}
            className={css`
            &:hover {
              background-color: ${token.colorBgTextHover};
            }
          `}
          >
            <span>中心</span>
            <CaretDownFilled />
          </div>
        </Popover>
      </div>
    );
  };
  const AppCard = () => {
    interface Option {
      value?: string | number | null;
      label: React.ReactNode;
      children?: Option[];
      isLeaf?: boolean;
      loading?: boolean;
    }
    const onChange = (value) => {
      if (value.length == 2) {
        handle_apps_change(value[1], value[0].replace('group_', ''));
      }
    };

    const { token } = theme.useToken();
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Divider
          style={{
            height: '1.5em',
          }}
          type="vertical"
        />
        <Cascader
          onChange={onChange}
          options={apps}
          fieldNames={{ label: 'name', value: 'id', children: 'children' }}
          style={{
            width: 'calc(100vw - 24px)',
            padding: '24px',
            paddingTop: 8,
            height: '307px',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <div
            style={{
              color: token.colorTextHeading,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              gap: 4,
              paddingInlineStart: 8,
              paddingInlineEnd: 12,
              alignItems: 'center',
            }}
            className={css`
            &:hover {
              background-color: ${token.colorBgTextHover};
            }
          `}
          >
            <span>应用</span>
            <CaretDownFilled />
          </div>
        </Cascader>
      </div>
    );
  };
  const Container_extra = (buttons: [{ onClick: ""; url: ""; title: "" }]) => {
    return buttons.map((val, key) => {
      return (
        <Link
          onClick={val.onClick ? val.onClick : () => { }}
          key={key}
          to={val.url ? val.url : "#!"}
        >
          <Button type="primary" shape="round">
            {val.title}
          </Button>
        </Link>
      );
    });
  };
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'mix',
    siderMenuType: 'sub',
  });
  const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
  // console.log(settings);
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ProLayout
          title='有盐编辑后台'
          prefixCls="my-prefix"
          bgLayoutImgList={[
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              left: 85,
              bottom: 100,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              bottom: -68,
              right: -45,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
              bottom: 0,
              left: 0,
              width: '331px',
            },
          ]}
          {...defaultProps}
          location={{
            pathname,
          }}
          menu={{
            collapsedShowGroupTitle: true,
            type: 'sub', request: async () => loopMenuItem(columns || [])
          }}
          avatarProps={{
            render: () => {
              return (
                <AvatarDropdown history={props.history} />
              );
            },
          }}
          actionsRender={() => {
            return [<MenusDropdown history={props.history} />];

          }}

          headerTitleRender={(logo, title, _) => {
            const defaultDom = (
              <Link to='/'>
                {logo}
                {title}
              </Link>
            );
            // if (document.body.clientWidth < 1400) {
            //   return defaultDom;
            // }
            // if (_.isMobile) return defaultDom;
            return (
              <>
                {defaultDom}
                <MenuCard />
                <AppCard />
              </>
            );
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed) return undefined;
            return (
              <div
                style={{
                  textAlign: 'center',
                  paddingBlockStart: 12,
                }}
              >
                <div>© 2022 Made with love</div>
                <div>by Ant Design</div>
              </div>
            );
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => (
            <Link
              key={item.id}
              to={`${item.path}`}
              onClick={() => {
                setPathname(item.path || "/welcome");
              }}
            >
              {dom}
            </Link>
          )}
          breadcrumbProps={{
            itemRender: (route) => {
              // console.log(route);
              return route.path ? <Link to={route.path}>{route.breadcrumbName}</Link> : route.breadcrumbName;
            },
          }}
          breadcrumbRender={(routers = []) => {
            const r = breadcrumb.lists.map((val, key) => {
              return {
                path: val.url,
                breadcrumbName: val.title,
              };
            });
            // console.log(r);
            return r;
          }}
          {...settings}
        >
          <PageContainer
            extra={Container_extra(breadcrumb.buttons)}
            subTitle={breadcrumb.title}
          >
            <div
              style={{
                minHeight: "100vh",
              }}
            >
              <Suspense fallback={<Loading />}>
                <Switch>{Irouters(routers)}</Switch>
              </Suspense>


            </div>
          </PageContainer>

          <SettingDrawer
            pathname={pathname}
            enableDarkTheme
            getContainer={() => document.getElementById('test-pro-layout')}
            settings={settings}
            onSettingChange={(changeSetting) => {
              setSetting(changeSetting);
            }}
            disableUrlParams={true}
          />
        </ProLayout>
      </ProConfigProvider>
    </div>
  );
};
export default Layout;