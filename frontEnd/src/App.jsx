import React from 'react'
import { Routes, Route } from 'react-router-dom'

import HomePage from './components/homePage/HomePage'
import RegisterPage from './components/registerPage/RegisterPage'
import LoginPage from './components/loginPage/LoginPage'
import MainDashboard from './components/dashboard/MainDashboard'
import DashboardLayout from './components/layout'
import NotFoundPage from './components/misc/NotFoundPage'
import AllContactsPage from './components/allContactsPage/AllContactsPage'
import AllGroupsPage from './components/allGroupsPage/AllGroupsPage'
import GenericGroup from './components/genericGroup/GenericGroup'
import GenericContact from './components/genericContact/GenericContact'










const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Dashboard Layout Outlet */}
      <Route path='/dashboard' element={<DashboardLayout/>}>
        <Route index element={<MainDashboard />} />       
        
        <Route path="spend" element={<MainDashboard />} />
        <Route path="transactions" element={<MainDashboard />} />
        <Route path="groups" element={<AllGroupsPage/>} />
        <Route path="contacts" element={<AllContactsPage/>} />
        <Route path="group/*" element={<GenericGroup />}/>
        <Route path="contact/*" element={<GenericContact/>} />
      </Route>
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage/>} />
      </Routes> 
  )
}
export default App