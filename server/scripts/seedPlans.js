import 'dotenv/config';
import { connectDB } from '../src/lib/db.js';
import { Plan } from '../src/models/plan.js';

async function main() {
  await connectDB();
  const defaults = [
    { name: 'Starter', description: 'Up to 10 users', priceMonthly: 990, currency: 'usd' },
    { name: 'Business', description: 'Up to 50 users', priceMonthly: 2990, currency: 'usd' },
    { name: 'Enterprise', description: '100+ users', priceMonthly: 9990, currency: 'usd' },
  ];
  for (const p of defaults) {
    const existing = await Plan.findOne({ name: p.name });
    if (!existing) {
      await Plan.create(p);
      console.log('Inserted plan', p.name);
    } else {
      console.log('Plan exists', p.name);
    }
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
