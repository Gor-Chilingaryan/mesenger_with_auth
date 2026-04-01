/**
 * Module: index.js
 * Description: Application entry point — loads environment configuration, establishes the MongoDB connection, and starts the Express HTTP listener.
 * Role in request lifecycle: Bootstrap only. Runs once at process start; does not participate in individual request/response cycles.
 */
import app from './src/app.js'
import 'dotenv/config'
import connectDB from './src/config/dataB.js'

const PORT = process.env.PORT || 3000

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀🚀🚀`)
})
