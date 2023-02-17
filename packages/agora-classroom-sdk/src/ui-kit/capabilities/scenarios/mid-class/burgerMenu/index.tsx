import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './index.css';

export class BurgerMenu extends React.Component {
  state = {
    menuOpen: false,
  };

  handleStateChange(state: any) {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <Menu
        isOpen={this.state.menuOpen}
        onStateChange={(state: any) => this.handleStateChange(state)}>
        {this.props.children}
      </Menu>
    );
  }
}
