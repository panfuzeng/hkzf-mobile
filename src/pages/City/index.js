import React from 'react'
import axios from 'axios'
import { getCurrenCity, setCity } from 'utils/index.js'
import { List, AutoSizer } from 'react-virtualized'
import 'react-virtualized/styles.css'
import style from './index.module.scss'
import Navbar from 'common/NavHead'
import { Toast } from 'antd-mobile'

const CITYS = ['北京', '上海', '深圳', '广州']

class City extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityObj: {},
      shortList: [],
      currentIndex: 0
    }
    this.listRef = React.createRef()
  }

  // 获取数据和首字母
  formatData(list) {
    const cityObj = {}
    list.forEach(item => {
      const key = item.short.slice(0, 1)
      if (key in cityObj) {
        cityObj[key].push(item)
      } else {
        cityObj[key] = [item]
      }
    })
    const shortList = Object.keys(cityObj).sort()
    return {
      cityObj,
      shortList
    }
  }
  // 点击城市跳转为当前城市
  selectCity(item) {
    if (CITYS.includes(item.label)) {
      // 存储当前城市
      setCity(item)
      this.props.history.push('/home')
    } else {
      Toast.info('你选择的城市暂无房源信息！！', 2)
    }
  }
  // 渲染长列表
  rowRenderer({ key, index, style }) {
    // 根据下标得到首字母
    const title = this.state.shortList[index]
    // 根据首字母得到列表
    const list = this.state.cityObj[title]

    return (
      <div key={key} style={style} className="city-item ">
        <div className="title">{this.formatTitle(title)}</div>
        {list.map(item => (
          <div
            className="name"
            key={item.label}
            onClick={this.selectCity.bind(this, item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 处理标题显示
  formatTitle(title) {
    if (title === '#') {
      title = '当前城市'
    } else if (title === 'hot') {
      title = '热门城市'
    } else {
      title = title.toUpperCase()
    }
    return title
  }
  // 计算每行的高
  caclHeight({ index }) {
    const title = this.state.shortList[index]
    const list = this.state.cityObj[title]
    return 37 + 50 * list.length
  }

  // 右边菜单
  rightMenu() {
    return (
      <ul className="right">
        {this.state.shortList.map((item, index) => (
          <li key={item} onClick={this.scrollToRow.bind(this, index)}>
            <span className={index === this.state.currentIndex ? 'active' : ''}>
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    )
  }
  // 滚动高亮
  onRowsRendered({ startIndex }) {
    this.setState({
      currentIndex: startIndex
    })
  }
  // 封装
  async getCityList() {
    // 获取一线城市列表
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { cityObj, shortList } = this.formatData(res.data.body)

    // 获取热门城市
    const hot = await axios.get('http://localhost:8080/area/hot')
    // 往对象中添加热门城市
    shortList.unshift('hot')
    cityObj['hot'] = hot.data.body
    // 添加当前城市
    shortList.unshift('#')
    const city = await getCurrenCity()
    cityObj['#'] = [city]
    this.setState({
      cityObj,
      shortList
    })
  }
  // 点击右边字母，显示对应城市
  scrollToRow(index) {
    this.listRef.current.scrollToRow(index)
  }
  async componentDidMount() {
    await this.getCityList()
    // 先计算每行的高度，解决对不准的bug
    this.listRef.current.measureAllRows()
  }

  render() {
    return (
      <div className={style.city}>
        <Navbar>城市选择</Navbar>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.listRef}
              width={width}
              height={height}
              scrollToAlignment="start"
              onRowsRendered={this.onRowsRendered.bind(this)}
              rowCount={this.state.shortList.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
            />
          )}
        </AutoSizer>
        {this.rightMenu()}
      </div>
    )
  }
}
export default City
