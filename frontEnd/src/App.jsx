import React from 'react'
import { Routes, Route } from 'react-router-dom'

import HomePage from './components/homePage/HomePage'
import RegisterPage from './components/registerPage/RegisterPage'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  )
}

export default App
