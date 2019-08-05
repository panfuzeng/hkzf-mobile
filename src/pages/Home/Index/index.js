import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './index.scss'
import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'
const navList = [
  { title: '整租', path: '/home/house', imgSrc: Nav1 },
  { title: '合租', path: '/home/house', imgSrc: Nav2 },
  { title: '地图找房', path: '/map', imgSrc: Nav3 },
  { title: '去出租', path: '/home/house', imgSrc: Nav4 }
]

class Index extends React.Component {
  state = {
    swiper: [],
    group: [],
    news: [],
    imgHeight: 212,
    flag: false,
    cityName: '北京'
  }

  // 获取轮播图图片
  async getSwiper() {
    const { data } = await axios.get('http://localhost:8080/home/swiper')
    if (data.status === 200) {
      this.setState({
        swiper: data.body,
        flag: true
      })
    }
  }
  // 获取租房小组信息
  async getGroup() {
    const res = await axios.get(
      'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        group: body
      })
    }
  }
  async getNews() {
    const res = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        news: body
      })
    }
  }
  componentDidMount() {
    this.getSwiper()
    this.getGroup()
    this.getNews()
    const myCity = new window.BMap.LocalCity()
    myCity.get(async resule => {
      const name = resule.name
      const res = await axios.get('http://localhost:8080/area/info', {
        params: {
          name: name
        }
      })
      const { status, body } = res.data
      if (status === 200) {
        localStorage.setItem('cityName', JSON.stringify(body))
        this.setState({
          cityName: body.label
        })
      }
    })
  }
  // 渲染轮播图
  renderBanner() {
    if (!this.state.flag) {
      return
    }
    return (
      <Carousel infinite autoplay>
        {this.state.swiper.map(item => (
          <a
            key={item.id}
            href="http://www.baidu.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }
  // 渲染搜索框
  renderSearch() {
    return (
      <Flex className="serachbox">
        <Flex className="serachfrom">
          <div
            className="location"
            onClick={() => this.props.history.push('/city')}
          >
            <span>{this.state.cityName}</span>
            <i className="iconfont icon-arrow" /> |
          </div>
          <div
            className="seractinput"
            onClick={() => this.props.history.push('/search')}
          >
            <i className="iconfont icon-seach" />
            <span>请输入搜索小区地址</span>
          </div>
        </Flex>
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
  // 渲染导航
  renderNav() {
    return (
      <Flex>
        {navList.map(item => (
          <Flex.Item key={item.title}>
            <Link to={item.path}>
              <img src={item.imgSrc} alt="" />
              <p>{item.title}</p>
            </Link>
          </Flex.Item>
        ))}
      </Flex>
    )
  }
  // 渲染租房小组
  renderGroup() {
    return (
      <>
        <div className="group-title">
          <h3>
            租房小组
            <span>更多</span>
          </h3>
        </div>
        <div className="group-content">
          <Grid
            data={this.state.group}
            columnNum={2}
            hasLine={false}
            square={false}
            renderItem={el => (
              <Flex justify="around">
                <div className="news">
                  <p>{el.title}</p>
                  <span>{el.desc}</span>
                </div>
                <img src={`http://localhost:8080${el.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
      </>
    )
  }
  // 渲染最新资讯
  renderNews() {
    return (
      <>
        <h3 className="group-title">最新资讯</h3>
        {this.state.news.map(item => (
          <Flex className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.data}</span>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </>
    )
  }
  render() {
    return (
      <div className="index">
        <div className="banner">
          {/* 调用轮播图 */}
          {/* 搜索框 */}
          {this.renderSearch()}
          {this.renderBanner()}
        </div>
        {/* 导航 */}
        <div className="nav">{this.renderNav()}</div>
        {/* 租房小组 */}
        <div className="group">{this.renderGroup()}</div>
        {/* 最新资讯 */}
        <div className="info">{this.renderNews()}</div>
      </div>
    )
  }
}
export default Index
