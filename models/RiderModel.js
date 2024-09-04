import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  language: { type: String, required: true },
  category: { type: String, required: true },
  availability: { type: String },
  qualification: { type: String, required: true },
  address: { type: String },
  panNumber: { type: String },
  aadharNumber: { type: String },
  gender: { type: String },
  religion: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },
  maritalStatus: { type: String },
  wifeName: { type: String },
  wifeAadharNumber: { type: String },
  wifePanNumber: { type: String },
  jobStatus: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  branch: { type: String },
  ifscCode: { type: String },
  paymentReceiver: { type: String },
  relationBankName: { type: String },
  relationAccountNumber: { type: String },
  relationBranch: { type: String },
  relationIfscCode: { type: String },
  marksheet: { type: Buffer },
  image: { type: Buffer },
  checkBook: { type: Buffer },
  guardianOptions: [{ type: String }],
  customRequirements: { type: String },
  password:{type:String}
});


// Hash the password before saving
riderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Rider = mongoose.model('Rider', riderSchema);
export default Rider;