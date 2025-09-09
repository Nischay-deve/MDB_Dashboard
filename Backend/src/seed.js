import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './db.js';
dotenv.config();

async function main() {
  // Create an admin user if none exists
  const email = 'admin@example.com';
  const password = 'P@ssw0rd!';
  const hash = await bcrypt.hash(password, 10);

  await pool.execute(
    'INSERT IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    [email, hash, 'admin']
  );

  // Seed some transactions
  const statuses = ['pending', 'success', 'failed', 'refunded'];
  for (let i = 0; i < 120; i++) {
    const serial = 'SN' + String(100000 + i);
    const amount = (Math.random() * 1000 + 10).toFixed(2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const device = 'DEV-' + (1 + Math.floor(Math.random() * 5));
    const created = new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60
    ); // last 60 days

    await pool.execute(
      'INSERT INTO transactions (serial_no, amount, status, device_id, created_at) VALUES (?, ?, ?, ?, ?)',
      [serial, amount, status, device, created]
    );
  }

  console.log('✅ Seed complete. Admin: admin@example.com / P@ssw0rd!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
