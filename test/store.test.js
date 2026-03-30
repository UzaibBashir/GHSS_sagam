import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit } from "../app/api/_lib/store.js";

test("checkRateLimit enforces limit and returns retryAfter", () => {
  const store = { rateLimits: {} };
  const limit = 2;
  const windowSeconds = 10;

  const first = checkRateLimit(store, "ip:1", limit, windowSeconds);
  const second = checkRateLimit(store, "ip:1", limit, windowSeconds);
  const third = checkRateLimit(store, "ip:1", limit, windowSeconds);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(third.ok, false);
  assert.equal(third.retryAfter > 0, true);
});

