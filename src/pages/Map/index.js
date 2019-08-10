import React from 'react'
import Navbar from 'common/NavHead'
import style from './index.module.scss'
import { getCurrenCity } from 'utils'
import { Toast } from 'antd-mobile'
import Axios from 'axios'
const BMap = window.BMap
class Map extends React.Component {
  state = {
    isShowRect: false,
    house: []
  }
  // 设置渲染类型
  getType() {
    let type, nextZoom
    const zoom = this.map.getZoom()
    if (zoom === 11) {
      type = 'yuan'
      nextZoom = 13
    } else if (zoom === 13) {
      type = 'yuan'
      nextZoom = 15
    } else {
      type = 'rect'
      nextZoom = 15
    }
    return {
      type,
      nextZoom
    }
  }
  // 判断渲染类型
  isRenderType(item, type, nextZoom) {
    if (type === 'yuan') {
      this.renderYuan(item, nextZoom)
    } else {
      this.renderRect(item, nextZoom)
    }
  }
  // 渲染圆
  renderYuan(item, nextZoom) {
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    var label = new BMap.Label(
      `
      <div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>
      `,
      {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-46, -15) //设置文本偏移量
      }
    ) // 创建文本标注对象
    label.setStyle({
      border: 'none',
      padding: 0
    })
    label.addEventListener('click', () => {
      // 清楚数据
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      // 设置中心点和缩放层级
      this.map.centerAndZoom(point, nextZoom)
      // 渲染下一级
      this.renderMap(item.value)
    })
    this.map.addOverlay(label)
  }
  // 渲染小区房源（方）
  renderRect(item) {
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    var label = new BMap.Label(
      `
      <div class="rect">
          <span class="housename">${item.label}</span>
        <span class="housenum">${item.count} 套</span>
        <i class="arrow"></i>
      </div>
      `,
      {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-50, -35) //设置文本偏移量
      }
    ) // 创建文本标注对象
    label.setStyle({
      border: 'none',
      padding: 0
    })
    label.addEventListener('click', e => {
      console.log(e)
      this.map.panBy(
        window.innerWidth / 2 - e.changedTouches[0].clientX,
        (window.innerHeight - 330 - 45) / 2 - e.changedTouches[0].clientY
      )
      Toast.loading('加载中...', 0)
      Axios.get(`http://localhost:8080/houses?cityId=${item.value}`).then(
        res => {
          this.setState({
            isShowRect: true,
            house: res.data.body.list
          })
          Toast.hide()
        }
      )
    })
    this.map.addEventListener('movestart', () => {
      this.setState({
        isShowRect: false
      })
    })
    this.map.addOverlay(label)
  }
  // 发送请求，获取城市房屋数据
  async renderMap(id) {
    // 获取类型
    Toast.loading('加载中...', 0)
    const { type, nextZoom } = this.getType()
    const res = await Axios.get(`http://localhost:8080/area/map?id=${id}`)
    res.data.body.forEach(item => {
      this.isRenderType(item, type, nextZoom)
    })
    Toast.hide()
  }
  // 初始化地图
  async initMap() {
    const city = await getCurrenCity()
    var map = new BMap.Map('container')
    this.map = map
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      city.label,
      async point => {
        // 设置中心点，缩放层级
        map.centerAndZoom(point, 11)
        //添加控件，比例尺，缩放
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())
        // 调用方法，获取数据
        this.renderMap(city.value)
      },
      city.label
    )
  }
  componentDidMount() {
    this.initMap()
  }

  render() {
    return (
      <div className={style.map}>
        <Navbar>地图找房</Navbar>
        <div id="container" />
        <div className={`houseList ${this.state.isShowRect ? 'show' : ''}`}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">
            {this.state.house.map(item => (
              <div className="house" key={item.houseCode}>
                <div className="imgWrap">
                  <img
                    className="img"
                    src={`http://localhost:8080${item.houseImg}`}
                    alt=""
                  />
                </div>
                <div className="content">
                  <h3 className="title">{item.title}</h3>
                  <div className="desc">{item.desc}</div>
                  <div>
                    {item.tags.map((item, index) => (
                      <span className={`tag tag${(index % 3) + 1}`} key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="price">
                    <span className="priceNum">{item.price}</span> 元/月
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
export default Map
