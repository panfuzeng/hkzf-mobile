import React from 'react'
import { NavBar } from 'antd-mobile'
import style from './index.module.scss'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
class Navbar extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired
  }
  render() {
    return (
      <NavBar
        className={style.navBar}
        mode="dark"
        leftContent={
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
        }
      >
        {this.props.children}
      </NavBar>
    )
  }
}
export default withRouter(Navbar)
