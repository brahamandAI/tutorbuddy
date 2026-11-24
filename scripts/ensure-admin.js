const fs = require('fs');
const path = require('path');
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@tutorbuddy.ai';
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    const reset = process.env.ADMIN_RESET === '1' || !existing;
    if (!reset) {
      if (!existing.isAdmin) {
        await prisma.user.update({ where: { email }, data: { isAdmin: true } });
      }
      console.log(`Admin already exists: ${email}`);
      console.log('Set ADMIN_RESET=1 to issue a new password.');
      return;
    }
    const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');
    const hash = await bcrypt.hash(password, 10);
    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { password: hash, isAdmin: true, role: 'ADMIN', emailVerified: true },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hash,
          name: 'TutorBuddy Admin',
          role: 'ADMIN',
          provider: 'email',
          isAdmin: true,
          emailVerified: true,
        },
      });
    }
    console.log(`ADMIN_EMAIL=${email}`);
    console.log(`ADMIN_PASSWORD=${password}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
