import { Space } from "antd";
import Avatar from './AvatarDropdown';
// import NoticeIconView from './NoticeIcon';
// import Menus from './MenusDropdown'; 
const GlobalHeaderRight: React.FC = () => {
  // let className = styles.right;  className={className}
  return (
    <>
      <Space >
      {/* <NoticeIconView /> */}
      {/* <Menus /> */}
      <Avatar/> 
      </Space>
    </>
  );
};
export default GlobalHeaderRight;
