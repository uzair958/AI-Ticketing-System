import './App.css'
import { DashboardPage, useDashboard } from './features/dashboard'

function App() {
  const dashboard = useDashboard()

  return <DashboardPage {...dashboard} />
}

export default App