import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/city" component={City} />
            <Route path="/map" component={Map} />
          </Switch>
        </Router>
      </div>
    )
  }
}
export default App
