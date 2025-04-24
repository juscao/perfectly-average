import { Hitter, HitterAverages, HitterExtremes } from "../types/hitting.types";

export const calculateHitterAverages = (hitters: Hitter[]) => {
  let sumOfRuns = 0;
  let sumOfHits = 0;
  let sumOfDoubles = 0;
  let sumOfTriples = 0;
  let sumOfHomeRuns = 0;
  let sumOfRBI = 0;
  let sumOfBaseOnBalls = 0;
  let sumOfHitByPitch = 0;
  let sumOfSacFlies = 0;
  let sumOfStrikeOuts = 0;
  let sumOfPlateAppearances = 0;
  let sumOfAtBats = 0;
  for (let i = 0; i < hitters.length; i++) {
    sumOfRuns += hitters[i].stat.runs;
    sumOfHits += hitters[i].stat.hits;
    sumOfDoubles += hitters[i].stat.doubles;
    sumOfTriples += hitters[i].stat.triples;
    sumOfHomeRuns += hitters[i].stat.homeRuns;
    sumOfRBI += hitters[i].stat.rbi;
    sumOfBaseOnBalls += hitters[i].stat.baseOnBalls;
    sumOfHitByPitch += hitters[i].stat.hitByPitch;
    sumOfSacFlies += hitters[i].stat.sacFlies || 0;
    sumOfStrikeOuts += hitters[i].stat.strikeOuts;
    sumOfPlateAppearances += hitters[i].stat.plateAppearances;
    sumOfAtBats += hitters[i].stat.atBats;
  }
  return {
    avg: sumOfHits / sumOfAtBats,
    obp:
      (sumOfHits + sumOfBaseOnBalls + sumOfHitByPitch) /
      (sumOfAtBats + sumOfBaseOnBalls + sumOfHitByPitch + (sumOfSacFlies || 0)),
    slg:
      (sumOfHits -
        sumOfDoubles -
        sumOfTriples -
        sumOfHomeRuns +
        2 * sumOfDoubles +
        3 * sumOfTriples +
        4 * sumOfHomeRuns) /
      sumOfAtBats,
    ops:
      (sumOfHits + sumOfBaseOnBalls + sumOfHitByPitch) /
        (sumOfAtBats +
          sumOfBaseOnBalls +
          sumOfHitByPitch +
          (sumOfSacFlies || 0)) +
      (sumOfHits -
        sumOfDoubles -
        sumOfTriples -
        sumOfHomeRuns +
        2 * sumOfDoubles +
        3 * sumOfTriples +
        4 * sumOfHomeRuns) /
        sumOfAtBats,
    runs: 100 * (sumOfRuns / sumOfPlateAppearances),
    hits: 100 * (sumOfHits / sumOfPlateAppearances),
    doubles: 100 * (sumOfDoubles / sumOfPlateAppearances),
    triples: 100 * (sumOfTriples / sumOfPlateAppearances),
    homeRuns: 100 * (sumOfHomeRuns / sumOfPlateAppearances),
    rbi: 100 * (sumOfRBI / sumOfPlateAppearances),
    baseOnBalls: 100 * (sumOfBaseOnBalls / sumOfPlateAppearances),
    strikeOuts: 100 * (sumOfStrikeOuts / sumOfPlateAppearances),
  };
};

export const calculateHitterExtremes = (hitters: Hitter[]) => {
  return hitters.reduce(
    (extremes, hitter) => {
      const updateExtremes = (stat: keyof typeof extremes, value: number) => {
        extremes[stat].highest = Math.max(extremes[stat].highest, value);
        extremes[stat].lowest = Math.min(extremes[stat].lowest, value);
      };
      const avg = hitter.stat.hits / hitter.stat.atBats;
      const obp =
        (hitter.stat.hits + hitter.stat.baseOnBalls + hitter.stat.hitByPitch) /
        (hitter.stat.atBats +
          hitter.stat.baseOnBalls +
          hitter.stat.hitByPitch +
          (hitter.stat.sacFlies || 0));
      const slg =
        (hitter.stat.hits -
          hitter.stat.doubles -
          hitter.stat.triples -
          hitter.stat.homeRuns +
          2 * hitter.stat.doubles +
          3 * hitter.stat.triples +
          4 * hitter.stat.homeRuns) /
        hitter.stat.atBats;
      const ops = obp + slg;
      const runs = (100 * hitter.stat.runs) / hitter.stat.plateAppearances;
      const hits = (100 * hitter.stat.hits) / hitter.stat.plateAppearances;
      const doubles =
        (100 * hitter.stat.doubles) / hitter.stat.plateAppearances;
      const triples =
        (100 * hitter.stat.triples) / hitter.stat.plateAppearances;
      const homeRuns =
        (100 * hitter.stat.homeRuns) / hitter.stat.plateAppearances;
      const rbi = (100 * hitter.stat.rbi) / hitter.stat.plateAppearances;
      const baseOnBalls =
        (100 * hitter.stat.baseOnBalls) / hitter.stat.plateAppearances;
      const strikeOuts =
        (100 * hitter.stat.strikeOuts) / hitter.stat.plateAppearances;

      updateExtremes("avg", avg);
      updateExtremes("obp", obp);
      updateExtremes("slg", slg);
      updateExtremes("ops", ops);
      updateExtremes("runs", runs);
      updateExtremes("hits", hits);
      updateExtremes("doubles", doubles);
      updateExtremes("triples", triples);
      updateExtremes("homeRuns", homeRuns);
      updateExtremes("rbi", rbi);
      updateExtremes("baseOnBalls", baseOnBalls);
      updateExtremes("strikeOuts", strikeOuts);

      return extremes;
    },
    {
      avg: { highest: 0, lowest: 0 },
      obp: { highest: 0, lowest: 0 },
      slg: { highest: 0, lowest: 0 },
      ops: { highest: 0, lowest: 0 },
      runs: { highest: 0, lowest: 0 },
      hits: { highest: 0, lowest: 0 },
      doubles: { highest: 0, lowest: 0 },
      triples: { highest: 0, lowest: 0 },
      homeRuns: { highest: 0, lowest: 0 },
      rbi: { highest: 0, lowest: 0 },
      baseOnBalls: { highest: 0, lowest: 0 },
      strikeOuts: { highest: 0, lowest: 0 },
    }
  );
};

export const calculateNormalizedStats = (
  hitter: Hitter,
  averages: HitterAverages
) => {
  const avg = hitter.stat.hits / hitter.stat.atBats;
  const obp =
    (hitter.stat.hits + hitter.stat.baseOnBalls + hitter.stat.hitByPitch) /
    (hitter.stat.atBats +
      hitter.stat.baseOnBalls +
      hitter.stat.hitByPitch +
      (hitter.stat.sacFlies || 0));
  const slg =
    (hitter.stat.hits -
      hitter.stat.doubles -
      hitter.stat.triples -
      hitter.stat.homeRuns +
      2 * hitter.stat.doubles +
      3 * hitter.stat.triples +
      4 * hitter.stat.homeRuns) /
    hitter.stat.atBats;
  const ops = obp + slg;
  const runs = (100 * hitter.stat.runs) / hitter.stat.plateAppearances;
  const hits = (100 * hitter.stat.hits) / hitter.stat.plateAppearances;
  const doubles = (100 * hitter.stat.doubles) / hitter.stat.plateAppearances;
  const triples = (100 * hitter.stat.triples) / hitter.stat.plateAppearances;
  const homeRuns = (100 * hitter.stat.homeRuns) / hitter.stat.plateAppearances;
  const rbi = (100 * hitter.stat.rbi) / hitter.stat.plateAppearances;
  const baseOnBalls =
    (100 * hitter.stat.baseOnBalls) / hitter.stat.plateAppearances;
  const strikeOuts =
    (100 * hitter.stat.strikeOuts) / hitter.stat.plateAppearances;
  return {
    avg:
      avg === averages.avg
        ? 100
        : (100 * (avg - averages.avg)) / averages.avg + 100,
    obp:
      obp === averages.obp
        ? 100
        : (100 * (obp - averages.obp)) / averages.obp + 100,
    slg:
      slg === averages.slg
        ? 100
        : (100 * (slg - averages.slg)) / averages.slg + 100,
    ops:
      ops === averages.ops
        ? 100
        : (100 * (ops - averages.ops)) / averages.ops + 100,
    runs:
      runs === averages.runs
        ? 100
        : (100 * (runs - averages.runs)) / averages.runs + 100,
    hits:
      hits === averages.hits
        ? 100
        : (100 * (hits - averages.hits)) / averages.hits + 100,
    doubles:
      doubles === averages.doubles
        ? 100
        : (100 * (doubles - averages.doubles)) / averages.doubles + 100,
    triples:
      triples === averages.triples
        ? 100
        : (100 * (triples - averages.triples)) / averages.triples + 100,
    homeRuns:
      homeRuns === averages.homeRuns
        ? 100
        : (100 * (homeRuns - averages.homeRuns)) / averages.homeRuns + 100,
    rbi:
      rbi === averages.rbi
        ? 100
        : (100 * (rbi - averages.rbi)) / averages.rbi + 100,
    baseOnBalls:
      baseOnBalls === averages.baseOnBalls
        ? 100
        : (100 * (baseOnBalls - averages.baseOnBalls)) / averages.baseOnBalls +
          100,
    strikeOuts:
      strikeOuts === averages.strikeOuts
        ? 100
        : (100 * (strikeOuts - averages.strikeOuts)) / averages.strikeOuts +
          100,
  };
};

export const calculateBackgroundOpacities = (
  hitter: Hitter,
  averages: HitterAverages,
  extremes: HitterExtremes
) => {
  const avg = hitter.stat.hits / hitter.stat.atBats;
  const obp =
    (hitter.stat.hits + hitter.stat.baseOnBalls + hitter.stat.hitByPitch) /
    (hitter.stat.atBats +
      hitter.stat.baseOnBalls +
      hitter.stat.hitByPitch +
      (hitter.stat.sacFlies || 0));
  const slg =
    (hitter.stat.hits -
      hitter.stat.doubles -
      hitter.stat.triples -
      hitter.stat.homeRuns +
      2 * hitter.stat.doubles +
      3 * hitter.stat.triples +
      4 * hitter.stat.homeRuns) /
    hitter.stat.atBats;
  const ops = obp + slg;
  const runs = 100 * (hitter.stat.runs / hitter.stat.plateAppearances);
  const hits = 100 * (hitter.stat.hits / hitter.stat.plateAppearances);
  const doubles = 100 * (hitter.stat.doubles / hitter.stat.plateAppearances);
  const triples = 100 * (hitter.stat.triples / hitter.stat.plateAppearances);
  const homeRuns = 100 * (hitter.stat.homeRuns / hitter.stat.plateAppearances);
  const rbi = 100 * (hitter.stat.rbi / hitter.stat.plateAppearances);
  const baseOnBalls =
    100 * (hitter.stat.baseOnBalls / hitter.stat.plateAppearances);
  const strikeOuts =
    100 * (hitter.stat.strikeOuts / hitter.stat.plateAppearances);
  return {
    avg: Math.abs(
      (avg - averages.avg) / (extremes.avg.highest - extremes.avg.lowest)
    ),
    obp: Math.abs(
      (obp - averages.obp) / (extremes.obp.highest - extremes.obp.lowest)
    ),
    slg: Math.abs(
      (slg - averages.slg) / (extremes.slg.highest - extremes.slg.lowest)
    ),
    ops: Math.abs(
      (ops - averages.ops) / (extremes.ops.highest - extremes.ops.lowest)
    ),
    runs: Math.abs(
      (runs - averages.runs) / (extremes.runs.highest - extremes.runs.lowest)
    ),
    hits: Math.abs(
      (hits - averages.hits) / (extremes.hits.highest - extremes.hits.lowest)
    ),
    doubles: Math.abs(
      (doubles - averages.doubles) /
        (extremes.doubles.highest - extremes.doubles.lowest)
    ),
    triples: Math.abs(
      (triples - averages.triples) /
        (extremes.triples.highest - extremes.triples.lowest)
    ),
    homeRuns: Math.abs(
      (homeRuns - averages.homeRuns) /
        (extremes.homeRuns.highest - extremes.homeRuns.lowest)
    ),
    rbi: Math.abs(
      (rbi - averages.rbi) / (extremes.rbi.highest - extremes.rbi.lowest)
    ),
    baseOnBalls: Math.abs(
      (baseOnBalls - averages.baseOnBalls) /
        (extremes.baseOnBalls.highest - extremes.baseOnBalls.lowest)
    ),
    strikeOuts: Math.abs(
      (strikeOuts - averages.strikeOuts) /
        (extremes.strikeOuts.highest - extremes.strikeOuts.lowest)
    ),
  };
};

export const sortHittersByStat = (
  hitters: Hitter[],
  stat: keyof HitterAverages,
  filterMethod: "highToLow" | "lowToHigh"
) => {
  const allHitterStats = [];
  for (let i = 0; i < hitters.length; i++) {
    allHitterStats.push({
      id: hitters[i].player.id,
      avg: hitters[i].stat.hits / hitters[i].stat.atBats,
      obp:
        (hitters[i].stat.hits +
          hitters[i].stat.baseOnBalls +
          hitters[i].stat.hitByPitch) /
        (hitters[i].stat.atBats +
          hitters[i].stat.baseOnBalls +
          hitters[i].stat.hitByPitch +
          (hitters[i].stat.sacFlies || 0)),
      slg:
        (hitters[i].stat.hits -
          hitters[i].stat.doubles -
          hitters[i].stat.triples -
          hitters[i].stat.homeRuns +
          2 * hitters[i].stat.doubles +
          3 * hitters[i].stat.triples +
          4 * hitters[i].stat.homeRuns) /
        hitters[i].stat.atBats,
      ops:
        (hitters[i].stat.hits +
          hitters[i].stat.baseOnBalls +
          hitters[i].stat.hitByPitch) /
          (hitters[i].stat.atBats +
            hitters[i].stat.baseOnBalls +
            hitters[i].stat.hitByPitch +
            (hitters[i].stat.sacFlies || 0)) +
        (hitters[i].stat.hits -
          hitters[i].stat.doubles -
          hitters[i].stat.triples -
          hitters[i].stat.homeRuns +
          2 * hitters[i].stat.doubles +
          3 * hitters[i].stat.triples +
          4 * hitters[i].stat.homeRuns) /
          hitters[i].stat.atBats,
      runs: hitters[i].stat.runs / hitters[i].stat.plateAppearances,
      hits: hitters[i].stat.hits / hitters[i].stat.plateAppearances,
      doubles: hitters[i].stat.doubles / hitters[i].stat.plateAppearances,
      triples: hitters[i].stat.triples / hitters[i].stat.plateAppearances,
      homeRuns: hitters[i].stat.homeRuns / hitters[i].stat.plateAppearances,
      rbi: hitters[i].stat.rbi / hitters[i].stat.plateAppearances,
      baseOnBalls:
        hitters[i].stat.baseOnBalls / hitters[i].stat.plateAppearances,
      strikeOuts: hitters[i].stat.strikeOuts / hitters[i].stat.plateAppearances,
    });
  }

  allHitterStats.sort((a, b) => {
    if (filterMethod === "highToLow") {
      return b[stat] - a[stat];
    } else {
      return a[stat] - b[stat];
    }
  });
  const sortedHitters = allHitterStats.map((statObj) => {
    return hitters.find((hitter) => hitter.player.id === statObj.id);
  });
  return sortedHitters;
};

export const calculateMostAverageHitter = (
  hitters: Hitter[],
  averages: HitterAverages
) => {
  const totals = [];
  for (let i = 0; i < hitters.length; i++) {
    const avg = hitters[i].stat.hits / hitters[i].stat.atBats;
    const obp =
      (hitters[i].stat.hits +
        hitters[i].stat.baseOnBalls +
        hitters[i].stat.hitByPitch) /
      (hitters[i].stat.atBats +
        hitters[i].stat.baseOnBalls +
        hitters[i].stat.hitByPitch +
        (hitters[i].stat.sacFlies || 0));
    const slg =
      (hitters[i].stat.hits -
        hitters[i].stat.doubles -
        hitters[i].stat.triples -
        hitters[i].stat.homeRuns +
        2 * hitters[i].stat.doubles +
        3 * hitters[i].stat.triples +
        4 * hitters[i].stat.homeRuns) /
      hitters[i].stat.atBats;
    const ops = obp + slg;
    const runs =
      (100 * hitters[i].stat.runs) / hitters[i].stat.plateAppearances;
    const hits =
      (100 * hitters[i].stat.hits) / hitters[i].stat.plateAppearances;
    const doubles =
      (100 * hitters[i].stat.doubles) / hitters[i].stat.plateAppearances;
    const triples =
      (100 * hitters[i].stat.triples) / hitters[i].stat.plateAppearances;
    const homeRuns =
      (100 * hitters[i].stat.homeRuns) / hitters[i].stat.plateAppearances;
    const rbi = (100 * hitters[i].stat.rbi) / hitters[i].stat.plateAppearances;
    const baseOnBalls =
      (100 * hitters[i].stat.baseOnBalls) / hitters[i].stat.plateAppearances;
    const strikeOuts =
      (100 * hitters[i].stat.strikeOuts) / hitters[i].stat.plateAppearances;

    const totalDeviation =
      Math.abs((avg - averages.avg) / averages.avg) +
      Math.abs((obp - averages.obp) / averages.obp) +
      Math.abs((slg - averages.slg) / averages.slg) +
      Math.abs((ops - averages.ops) / averages.ops) +
      Math.abs((runs - averages.runs) / averages.runs) +
      Math.abs((hits - averages.hits) / averages.hits) +
      Math.abs((doubles - averages.doubles) / averages.doubles) +
      Math.abs((triples - averages.triples) / averages.triples) +
      Math.abs((homeRuns - averages.homeRuns) / averages.homeRuns) +
      Math.abs((rbi - averages.rbi) / averages.rbi) +
      Math.abs((baseOnBalls - averages.baseOnBalls) / averages.baseOnBalls) +
      Math.abs((strikeOuts - averages.strikeOuts) / averages.strikeOuts);
    totals.push({
      name: hitters[i].player.fullName,
      averageAbsoluteDeviation: (100 * totalDeviation) / 12,
    });
  }
  const sorted = [...totals].sort(
    (a, b) => a.averageAbsoluteDeviation - b.averageAbsoluteDeviation
  );
  return sorted[0];
};
