import axiox from 'axios'
// 取当前城市
function getCity() {
  return JSON.parse(localStorage.getItem('cityName'))
}
// 存当前城市
export function setCity(city) {
  return localStorage.setItem('cityName', JSON.stringify(city))
}
export function getCurrenCity() {
  const city = getCity()

  if (city) {
    return Promise.resolve(city)
  } else {
    return new Promise((resolve, reject) => {
      const myCity = new window.BMap.LocalCity()
      myCity.get(resule => {
        const name = resule.name
        axiox
          .get('http://localhost:8080/area/info', {
            params: {
              name
            }
          })
          .then(res => {
            const { body } = res.data
            setCity(body)
            resolve(body)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  }
}
