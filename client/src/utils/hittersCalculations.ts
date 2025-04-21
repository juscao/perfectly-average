import { Hitter } from "../types/hitting.types";

export const calculateHitterAverages = (hitters: Hitter[]) => {
  let avgSum = 0;
  let obpSum = 0;
  let slgSum = 0;
  let opsSum = 0;
  for (let i = 0; i < hitters.length; i++) {
    avgSum += Number(hitters[i].stat.avg);
    obpSum += Number(hitters[i].stat.obp);
    slgSum += Number(hitters[i].stat.slg);
    opsSum += Number(hitters[i].stat.ops);
  }
  return {
    avg: (avgSum / hitters.length).toFixed(3).replace(/^0\./, "."),
    obp: (obpSum / hitters.length).toFixed(3).replace(/^0\./, "."),
    slg: (slgSum / hitters.length).toFixed(3).replace(/^0\./, "."),
    ops: (opsSum / hitters.length).toFixed(3).replace(/^0\./, "."),
  };
};

export const calculateHitterExtremes = (hitters: Hitter[]) => {
  const highestAvg = hitters.reduce((highest, current) => {
    return parseFloat(current.stat.avg) > parseFloat(highest.stat.avg)
      ? current
      : highest;
  }).stat.avg;
  const lowestAvg = hitters.reduce((lowest, current) => {
    return parseFloat(current.stat.avg) < parseFloat(lowest.stat.avg)
      ? current
      : lowest;
  }).stat.avg;
  const highestObp = hitters.reduce((highest, current) => {
    return parseFloat(current.stat.obp) > parseFloat(highest.stat.obp)
      ? current
      : highest;
  }).stat.obp;
  const lowestObp = hitters.reduce((lowest, current) => {
    return parseFloat(current.stat.obp) < parseFloat(lowest.stat.obp)
      ? current
      : lowest;
  }).stat.obp;
  const highestSlg = hitters.reduce((highest, current) => {
    return parseFloat(current.stat.slg) > parseFloat(highest.stat.slg)
      ? current
      : highest;
  }).stat.slg;
  const lowestSlg = hitters.reduce((lowest, current) => {
    return parseFloat(current.stat.slg) < parseFloat(lowest.stat.slg)
      ? current
      : lowest;
  }).stat.slg;
  const highestOps = hitters.reduce((highest, current) => {
    return parseFloat(current.stat.ops) > parseFloat(highest.stat.ops)
      ? current
      : highest;
  }).stat.ops;
  const lowestOps = hitters.reduce((lowest, current) => {
    return parseFloat(current.stat.ops) < parseFloat(lowest.stat.ops)
      ? current
      : lowest;
  }).stat.ops;
  return {
    highestAvg,
    lowestAvg,
    highestObp,
    lowestObp,
    highestSlg,
    lowestSlg,
    highestOps,
    lowestOps,
  };
};
