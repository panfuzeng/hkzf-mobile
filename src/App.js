import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
import NoMatch from './pages/NoMatch'
class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Redirect from="/" to="/home" exact />
          <Route path="/home" component={Home} />
          <Route path="/city" component={City} />
          <Route path="/map" component={Map} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}
export default App
