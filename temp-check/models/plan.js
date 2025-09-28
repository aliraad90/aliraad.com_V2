import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    priceMonthly: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    stripePriceId: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan = mongoose.model('Plan', PlanSchema);
