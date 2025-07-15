import admin from '../firebase-admin.js'
import users from '../models/users.js'

export const testRoute = async (req, res) => {
 
  res.send("Hello from the auth controller")

}




export const verifyLoginWithGoogle = async (req, res) => {
      
      // if there is no token in the body
      if (!req.body.token) {
          return res.status(400).json({ error: 'Token is required' })
      }
      
      const { token } = req.body
      

      // Let's verify the token using Firebase Admin SDK
      try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        const { email, name, picture } = decodedToken

        res.status(200).json({ message: 'Login successful', user: { email, name, picture } })
      }
      catch (error) {
        console.error('Error verifying token:', error)
        res.status(401).json({ error: 'Invalid token' })
      }

}   

