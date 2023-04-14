import React from "react";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import HeaderDropdown from "./HeaderDropdown";
// import styles from "./RightContent.module.less";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
export type GlobalHeaderRightProps = {
  menu?: boolean;
};
type State = {
  server: Server.Server;
};
 
const AvatarDropdown: React.FC<{history?:any}> = (props) => {
  const { ucdata } = useSelector((state: Server.Props) => state.server);
  const menuHeaderDropdown = [
    {
      key: '/user/center',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: '/account/profile',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      key: '/auth/logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },

  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: (m)=>{
          props.history.replace(m.key);  
        },
        items: menuHeaderDropdown,
      }} >

      <Avatar
        size={'large'}
        src={ucdata.avatar}
        alt="avatar"
      />
    </HeaderDropdown>
  );
};
export default AvatarDropdown;
