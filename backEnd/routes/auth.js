
import express from 'express'
import { testRoute , verifyLoginWithGoogle , verifyIfUserNameIsUnique, onBoardingComplete, isProfileCompleted, normalLogin} from '../controllers/authController.js'

const AuthRouter = express.Router()

AuthRouter.get('/testroute', testRoute)

AuthRouter.post('/verifyLoginWithGoogle', verifyLoginWithGoogle)

AuthRouter.post('/verifyIfUserNameIsUnique', verifyIfUserNameIsUnique)

AuthRouter.post('/onBoardingComplete', onBoardingComplete)

AuthRouter.post('/isProfileCompleted', isProfileCompleted)

AuthRouter.post('/normalLogin', normalLogin)

export default AuthRouter
