import React, { useCallback } from "react";
import { Link, Redirect } from "react-router-dom"; 
import {
  SettingTwoTone,
  SettingOutlined,
  ScheduleFilled,
  ProfileFilled,
  InteractionFilled,
  DribbbleCircleFilled,
  CalculatorFilled
} from "@ant-design/icons";
import { Avatar, Menu, Spin } from "antd";
import HeaderDropdown from "./HeaderDropdown"; 
const MenusDropdown: React.FC<{history?:any}> = (props) => {
  console.log(props);
  const menuHeaderDropdown = [
    {
      key: '/columns',
      icon: <ScheduleFilled />,
      label: '栏目管理',
    },
    {
      key: '/menus',
      icon: <ScheduleFilled />,
      label: '菜单管理',
    },
    {
      key: '/competence',
      icon: <ScheduleFilled />,
      label: '角色管理',
    },
    {
      key: '/columns',
      icon: <ScheduleFilled />,
      label: '栏目管理',
    },
    {
      key: '/permission',
      icon: <ScheduleFilled />,
      label: '权限管理',
    },
    {
      key: '/customer',
      icon: <ScheduleFilled />,
      label: '商户管理',
    },
  ];
  return (
    <HeaderDropdown menu={{
      selectedKeys: [],
      onClick: (m)=>{
        props.history.replace(m.key);  
      },
      items: menuHeaderDropdown,
    }} >
      <SettingTwoTone />
    </HeaderDropdown>
  );
};

export default MenusDropdown;
