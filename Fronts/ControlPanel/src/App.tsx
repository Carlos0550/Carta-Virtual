import { Route, Routes } from "react-router-dom"
import "./App.css"
import "@mantine/core/styles.css"
import Dashboard from "./Pages/Dashboard/Dashboard"
import Auth from "./Pages/Auth/Auth"
import Layout from "./components/Layout"
import Business from "./Pages/Business/Business"
import MenuConfig from "./Pages/MenuConfig/MenuConfig"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="business" element={<Business/>}/>
        <Route path="menu-configuration" element={<MenuConfig/>}/>
      </Route>
      <Route path="/authentication" element={<Auth/>}/>
    </Routes>
  )
}

export default App
