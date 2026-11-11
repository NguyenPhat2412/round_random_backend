// Chọn người trúng ở lượt `round`.
// Người có tỷ lệ cho lượt này nhận đúng % đó; phần % còn lại chia đều cho người chưa đặt.
// Tổng > 100% hoặc ai cũng đã đặt thì chia theo tỷ lệ tương đối.
const weightsFor = (items, round) => {
  const rateOf = (item) =>
    (item.winRates || []).find((r) => r.round === round)?.rate;
  const fixed = items.map(rateOf);
  const sumFixed = fixed.reduce((s, r) => s + (r ?? 0), 0);
  const unsetCount = fixed.filter((r) => r === undefined).length;
  const share = unsetCount ? Math.max(0, 100 - sumFixed) / unsetCount : 0;
  const weights = fixed.map((r) => (r === undefined ? share : r));
  return weights.some((w) => w > 0) ? weights : items.map(() => 1);
};

const pickWinner = (items, round, random = Math.random) => {
  const weights = weightsFor(items, round);
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll < 0) return items[i];
  }
  return items[items.length - 1];
};

module.exports = { pickWinner, weightsFor };
