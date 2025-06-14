import { Route, Routes } from "react-router-dom"
import "./App.css"
import "@mantine/core/styles.css"
import Dashboard from "./Pages/Dashboard/Dashboard"
import Auth from "./Pages/Auth/Auth"
import Layout from "./components/Layout"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="dashboard" element={<Dashboard/>}/>
      </Route>
      <Route path="/authentication" element={<Auth/>}/>
    </Routes>
  )
}

export default App
