import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/lib/db.js';
import { User } from '../src/models/user.js';

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  await connectDB();
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ email, passwordHash: hash, role: 'admin' });
    console.log('Seeded admin:', email, '/', password);
  } else {
    console.log('Admin already exists:', email);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
