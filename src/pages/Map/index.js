import React from 'react'
import './index.scss'

class Map extends React.Component {
  componentDidMount() {
    const map = new window.BMap.Map('container')
    const point = new window.BMap.Point(121.61895125119062, 31.040452304898167)
    map.centerAndZoom(point, 18)
    const marker = new window.BMap.Marker(point)
    map.addOverlay(marker)
  }
  render() {
    return (
      <div className="map">
        <div id="container" />
      </div>
    )
  }
}
export default Map
