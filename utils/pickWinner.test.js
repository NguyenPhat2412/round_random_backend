const assert = require("node:assert");
const { pickWinner, weightsFor } = require("./pickWinner");
const items = [
  { name: "A", winRates: [{ round: 2, rate: 100 }] },
  { name: "B" },
  { name: "C", winRates: [{ round: 1, rate: 50 }] },
];
assert.deepStrictEqual(weightsFor(items, 1), [25, 25, 50]);
assert.deepStrictEqual(weightsFor(items, 2), [100, 0, 0]);
assert.deepStrictEqual(weightsFor(items, 3), [100 / 3, 100 / 3, 100 / 3]);
for (let i = 0; i < 50; i++) assert.strictEqual(pickWinner(items, 2).name, "A");
assert.deepStrictEqual(weightsFor([{ winRates: [{ round: 1, rate: 0 }] }], 1), [1]);
console.log("pickWinner ok");
