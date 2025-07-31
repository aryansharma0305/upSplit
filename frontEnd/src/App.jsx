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
import PaymentCardList from './components/pendingPayments/PendingPayments'
import TransactionHistoryTable from './components/transactionHistory/TransactionHistory'
import { Toaster } from "sonner"
import VerifyEmail from './components/VerifyEmail'
import OnBoardingPage from './components/onBoardingPage/OnBoardingPage'
import ProfilePage from './components/profilePage/ProfilePage'
import LogoutPage from './components/misc/LogoutPage'




const App = () => {
  
  return (
    <>

      <Toaster   position="top-center" richColors />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/logout' element={<LogoutPage />} />
          <Route path="/onboarding" element={<OnBoardingPage/>} />
          <Route path="/verifyEmail" element={<VerifyEmail/>} />


          {/* Dashboard Layout Outlet */}
          <Route path='/dashboard' element={<DashboardLayout/>}>
              <Route index element={<MainDashboard />} />         
              <Route path="pending-payments" element={<PaymentCardList/>} />
              <Route path="transaction-history" element={<TransactionHistoryTable/>} />
              <Route path="group/*" element={<GenericGroup />}/>
              <Route path="group" element={<AllGroupsPage />}/>
              <Route path="contact/*" element={<GenericContact/>} />
              <Route path="contact" element={<AllContactsPage/>} />
              {/* <Route path="notifications" element={<NotificationPage/>} /> */}
              <Route path="profile" element={<ProfilePage/>} />
              <Route path="*" element={<NotFoundPage/>} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage/>} />
      </Routes> 
      </>
  )
}
export default App