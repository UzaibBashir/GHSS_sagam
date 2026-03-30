import { randomBytes, scryptSync } from "node:crypto";

const plain = String(process.argv[2] || "").trim();
if (!plain) {
  console.error("Usage: npm run hash:password -- \"YourStrongPassword\"");
  process.exit(1);
}

const salt = randomBytes(16);
const digest = scryptSync(plain, salt, 64);
const encoded = `scrypt$v1$${salt.toString("base64url")}$${digest.toString("base64url")}`;
console.log(encoded);
