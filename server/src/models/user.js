import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'company'], required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    enabled: { type: Boolean, default: true, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const User = mongoose.model('User', UserSchema);
