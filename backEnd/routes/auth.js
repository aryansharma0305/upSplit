
import express from 'express'
import { testRoute , verifyLoginWithGoogle , verifyIfUserNameIsUnique, onBoardingComplete, isProfileCompleted,checkIfAuthorized, normalLogin, handleRegister,verifyEmailLinkForRegister, logout} from '../controllers/authController.js'

const AuthRouter = express.Router()

AuthRouter.get('/testroute', testRoute)

AuthRouter.post('/verifyLoginWithGoogle', verifyLoginWithGoogle)

AuthRouter.post('/verifyIfUserNameIsUnique', verifyIfUserNameIsUnique)

AuthRouter.post('/onBoardingComplete', onBoardingComplete)

AuthRouter.post('/isProfileCompleted', isProfileCompleted)

AuthRouter.post('/normalLogin', normalLogin)

AuthRouter.post('/register', handleRegister)

AuthRouter.post("/verifyEmailLinkForRegister", verifyEmailLinkForRegister)

AuthRouter.get("/logout", logout)

AuthRouter.get("/checkIfAuthorized", checkIfAuthorized)

export default AuthRouter
