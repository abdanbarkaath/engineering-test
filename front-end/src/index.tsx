import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import "index.css"
import * as serviceWorker from "shared/helpers/service-worker"
import StaffApp from "staff-app/app"
import { GlobalStyle } from "shared/styles/global-style"
import { Provider } from "react-redux"
import { createStore } from "redux"
import reducer from "./reducers"

const Home: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <p>Engineering Test</p>
        <Link to="staff/daily-care">Staff</Link>
      </header>
    </div>
  )
}

const store = createStore(reducer)

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home>Engineering Test</Home>} />
          <Route path="staff/*" element={<StaffApp />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

serviceWorker.register()
