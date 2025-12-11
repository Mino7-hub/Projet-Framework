import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email:      { type: String, required: true, lowercase: true },
  code:       { type: String, required: true },
  expiresAt:  { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export default mongoose.models.VerificationCode ||
                mongoose.model('VerificationCode', schema);