import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactEmail: { type: String },
    plan: { type: String },
    enabled: { type: Boolean, default: true, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const Company = mongoose.model('Company', CompanySchema);
