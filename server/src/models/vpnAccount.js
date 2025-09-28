import mongoose from 'mongoose';

const VpnAccountSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, default: 'ppp' },
    configText: { type: String },
    revokedAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const VpnAccount = mongoose.model('VpnAccount', VpnAccountSchema);
