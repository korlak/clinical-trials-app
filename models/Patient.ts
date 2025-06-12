import mongoose from 'mongoose'

const SignupSchema = new mongoose.Schema({
  nctId: String,
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
})

export default mongoose.models.Signup || mongoose.model('Signup', SignupSchema)