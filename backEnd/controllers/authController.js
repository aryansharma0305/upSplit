import e from 'express'
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

        const db_query_user= await users.findOne({ email: email })
        
        if(db_query_user){
          if(db_query_user.profileCompleted){
            // if the user is already registered and profile is completed
            res.status(200).json({ message: 'Login successful', user: { email, name, picture }, redirect:'/dashboard' })
          }
          else{
            res.status(200).json({ message: 'Login successful but profile is incomplete', user: { email, name, picture }, redirect:'/onboarding' })
          }
        }
        else{

          const newUser = new users({
            email: email,
            name: name,
            photoURL: picture,
            profileCompleted: false, 
            uid: decodedToken.uid 
          })

          await newUser.save()

          res.status(200).json({ message: 'User created successfully', user: { email, name, picture }, redirect:'/onboarding' })

        }

      }
      catch (error) {
        console.error('Error verifying token:', error)
        res.status(401).json({ error: 'Invalid token' })
      }

}   




export const verifyIfUserNameIsUnique = async (req, res) => {
  const { userName } = req.body

  if (!userName) {
    return res.status(400).json({ error: 'Username is required' })
  }

  try {
    const existingUser = await users.findOne({ userName: userName })

    if (existingUser) {
      return res.status(200).json({ isUnique: false, message: 'Username is already taken' })
    } else {
      return res.status(200).json({ isUnique: true, message: 'Username is available' })
    }
  } catch (error) {
    console.error('Error checking username uniqueness:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}