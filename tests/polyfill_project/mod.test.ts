// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

import { hasOwn } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";

Deno.test("should test the polyfill", () => {
  assertEquals(hasOwn({}), false);
  assertEquals(hasOwn({ prop: 5 }), true);
});
