import React from 'react';
import { Menu } from 'dpl-react';
import { getContainer } from './utils';

class WrapMenu extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return (<Menu
      {...props}
      getPopupContainer={getContainer}
    >
      {children}
    </Menu>);
  }
}

WrapMenu.SubMenu = Menu.SubMenu;
WrapMenu.Item = Menu.Item;

export default WrapMenu;
