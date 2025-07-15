import admin from "firebase-admin"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const serviceAccount = require("./firebase-admin-config.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default admin
