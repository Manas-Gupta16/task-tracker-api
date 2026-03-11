import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

function App() {

  const path = window.location.pathname

  if (path === "/dashboard") {
    return <Dashboard />
  }

  return <Login />
}

export default App