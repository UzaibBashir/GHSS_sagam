import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, isPasswordHash, verifyPasswordValue } from "../app/api/_lib/auth.js";

test("hashPassword generates verifiable scrypt hash", () => {
  const hash = hashPassword("StrongPass#123");
  assert.equal(isPasswordHash(hash), true);
  assert.equal(verifyPasswordValue("StrongPass#123", hash), true);
  assert.equal(verifyPasswordValue("WrongPass#123", hash), false);
});

test("verifyPasswordValue supports plain fallback", () => {
  assert.equal(verifyPasswordValue("abc123", "abc123"), true);
  assert.equal(verifyPasswordValue("abc123", "different"), false);
});

