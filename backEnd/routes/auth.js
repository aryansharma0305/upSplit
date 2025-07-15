
import express from 'express'
import { testRoute , verifyLoginWithGoogle } from '../controllers/authController.js'

const AuthRouter = express.Router()

AuthRouter.get('/testroute', testRoute)

AuthRouter.post('/verifyLoginWithGoogle', verifyLoginWithGoogle)

export default AuthRouter
