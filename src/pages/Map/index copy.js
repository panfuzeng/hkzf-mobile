import React from 'react'
import Navbar from 'common/NavHead'
import style from './index.module.scss'
import { getCurrenCity } from 'utils'
import Axios from 'axios'
const BMap = window.BMap
class Map extends React.Component {
  // 渲染地图
  async renderMap() {
    const city = await getCurrenCity()
    var map = new BMap.Map('container')

    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      city.label,
      async point => {
        map.centerAndZoom(point, 11)
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())
        const res = await Axios.get(
          `http://localhost:8080/area/map?id=${city.value}`
        )
        res.data.body.forEach(item => {
          point = new BMap.Point(item.coord.longitude, item.coord.latitude)
          const label = new BMap.Label(
            `<div class="bubble">
              <p class="name">${item.label}</p>
              <p>${item.count}套</p>
             </div>`,
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
              map.clearOverlays()
            }, 0)
            map.centerAndZoom(point, 13)
          })
          map.addOverlay(label)
        })
      },
      city.label
    )
  }
  componentDidMount() {
    this.renderMap()
  }

  render() {
    return (
      <div className={style.map}>
        <Navbar>地图找房</Navbar>
        <div id="container" />
      </div>
    )
  }
}
export default Map
