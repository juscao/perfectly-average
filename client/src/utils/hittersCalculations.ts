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
    sumOfSacFlies += hitters[i].stat.sacFlies;
    sumOfStrikeOuts += hitters[i].stat.strikeOuts;
    sumOfPlateAppearances += hitters[i].stat.plateAppearances;
    sumOfAtBats += hitters[i].stat.atBats;
  }
  return {
    avg: sumOfHits / sumOfAtBats,
    obp:
      (sumOfHits + sumOfBaseOnBalls + sumOfHitByPitch) /
      (sumOfAtBats + sumOfBaseOnBalls + sumOfHitByPitch + sumOfSacFlies),
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
        (sumOfAtBats + sumOfBaseOnBalls + sumOfHitByPitch + sumOfSacFlies) +
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
          hitter.stat.sacFlies);
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
      hitter.stat.sacFlies);
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
        : Math.round((100 * (avg - averages.avg)) / averages.avg + 100),
    obp:
      obp === averages.obp
        ? 100
        : Math.round((100 * (obp - averages.obp)) / averages.obp + 100),
    slg:
      slg === averages.slg
        ? 100
        : Math.round((100 * (slg - averages.slg)) / averages.slg + 100),
    ops:
      ops === averages.ops
        ? 100
        : Math.round((100 * (ops - averages.ops)) / averages.ops + 100),
    runs:
      runs === averages.runs
        ? 100
        : Math.round((100 * (runs - averages.runs)) / averages.runs + 100),
    hits:
      hits === averages.hits
        ? 100
        : Math.round((100 * (hits - averages.hits)) / averages.hits + 100),
    doubles:
      doubles === averages.doubles
        ? 100
        : Math.round(
            (100 * (doubles - averages.doubles)) / averages.doubles + 100
          ),
    triples:
      triples === averages.triples
        ? 100
        : Math.round(
            (100 * (triples - averages.triples)) / averages.triples + 100
          ),
    homeRuns:
      homeRuns === averages.homeRuns
        ? 100
        : Math.round(
            (100 * (homeRuns - averages.homeRuns)) / averages.homeRuns + 100
          ),
    rbi:
      rbi === averages.rbi
        ? 100
        : Math.round((100 * (rbi - averages.rbi)) / averages.rbi + 100),
    baseOnBalls:
      baseOnBalls === averages.baseOnBalls
        ? 100
        : Math.round(
            (100 * (baseOnBalls - averages.baseOnBalls)) /
              averages.baseOnBalls +
              100
          ),
    strikeOuts:
      strikeOuts === averages.strikeOuts
        ? 100
        : Math.round(
            (100 * (strikeOuts - averages.strikeOuts)) / averages.strikeOuts +
              100
          ),
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
      hitter.stat.sacFlies);
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
