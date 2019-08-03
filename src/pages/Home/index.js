import React from 'react'
import Index from './Index/index.js'
import House from './House'
import News from './News'
import My from './my'
import './index.scss'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
const homeList = [
  { title: '首页', icon: 'icon-ind', selected: '/home' },
  { title: '找房', icon: 'icon-findHouse', selected: '/home/house' },
  { title: '资讯', icon: 'icon-infom', selected: '/home/news' },
  { title: '我的', icon: 'icon-my', selected: '/home/my' }
]
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: props.location.pathname
    }
  }

  render() {
    return (
      <div className="index">
        <Route path="/home" component={Index} exact />
        <Route path="/home/house" component={House} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        <div className="tabBar">
          <TabBar tintColor="#21b97a">
            {homeList.map(item => (
              <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`} />}
                selectedIcon={<i className={`iconfont ${item.icon}`} />}
                selected={this.state.selectedTab === item.selected}
                onPress={() => {
                  this.setState({
                    selectedTab: item.selected
                  })
                  this.props.history.push(item.selected)
                }}
              />
            ))}
          </TabBar>
        </div>
      </div>
    )
  }
}
export default Home
