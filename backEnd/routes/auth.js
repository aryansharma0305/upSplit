
import express from 'express'
import { testRoute , verifyLoginWithGoogle , verifyIfUserNameIsUnique} from '../controllers/authController.js'

const AuthRouter = express.Router()

AuthRouter.get('/testroute', testRoute)

AuthRouter.post('/verifyLoginWithGoogle', verifyLoginWithGoogle)

AuthRouter.post('/verifyIfUserNameIsUnique', verifyIfUserNameIsUnique)

export default AuthRouter
