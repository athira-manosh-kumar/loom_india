import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterProducts,
  estimateFabric,
  escapeHTML,
  sizes,
} from "../domain.js";
test("occasion filtering spans garment families and respects budget", () => {
  const p = filterProducts({ category: "Festive", max: 7000 });
  assert.deepEqual(
    p.map((x) => x.id),
    ["gulab", "tara", "meher"],
  );
});
test("search and sort combine without mutating catalog", () => {
  assert.deepEqual(
    filterProducts({ query: "saree", sort: "low" }).map((p) => p.price),
    [1490, 6490, 12990],
  );
  assert.equal(filterProducts({ category: "Partywear", max: 1000 }).length, 0);
});
test("fabric estimate adapts to width, body fit and design", () => {
  const base = {
    length: 5.5,
    width: 140,
    chest: 91,
    hip: 99,
    silhouette: "dress",
  };
  assert.equal(estimateFabric(base).required, 4.2);
  assert.ok(estimateFabric({ ...base, width: 90 }).required > 4.2);
  assert.ok(estimateFabric({ ...base, hip: 120 }).required > 4.2);
  assert.equal(estimateFabric({ ...base, length: 2 }).enough, false);
  assert.ok(estimateFabric({ ...base, width: 0 }).error);
  assert.ok(estimateFabric({ ...base, chest: 200 }).error);
  assert.ok(estimateFabric({ ...base, length: NaN }).error);
});
test("customer inspiration is escaped before rendering", () => {
  assert.equal(
    escapeHTML('<img src=x onerror="alert(1)">'),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
  );
});
test("standard chart has increasing body dimensions", () => {
  const values = Object.values(sizes);
  assert.ok(
    values.every((v, i) => i === 0 || v.every((n, j) => n > values[i - 1][j])),
  );
});
