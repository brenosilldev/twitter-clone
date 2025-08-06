import Login from './pages/Login/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


export default function App() {
  return (
    <div>
      <Routes>
        <Route index path="/" element={<Login />} />
      </Routes>
    </div>
  )
}