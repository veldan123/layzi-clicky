#!/usr/bin/env node
// Run: node scripts/hash-password.js your-password-here
// Then add the output as ADMIN_PASSWORD in your .env.local

const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nBcrypt hash (add this as ADMIN_PASSWORD in .env.local):");
  console.log(hash);
  console.log();
});
