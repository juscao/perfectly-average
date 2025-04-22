import { Hitter } from "../types/hitting.types";

export const calculateHitterAverages = (hitters: Hitter[]) => {
  let sumOfR = 0;
  let sumOfH = 0;
  let sumOf2B = 0;
  let sumOf3B = 0;
  let sumOfHR = 0;
  let sumOfRBI = 0;
  let sumOfBB = 0;
  let sumOfHBP = 0;
  let sumOfSF = 0;
  let sumOfSO = 0;
  let sumOfPA = 0;
  let sumOfAB = 0;
  for (let i = 0; i < hitters.length; i++) {
    sumOfR += hitters[i].stat.runs;
    sumOfH += hitters[i].stat.hits;
    sumOf2B += hitters[i].stat.doubles;
    sumOf3B += hitters[i].stat.triples;
    sumOfHR += hitters[i].stat.homeRuns;
    sumOfRBI += hitters[i].stat.rbi;
    sumOfBB += hitters[i].stat.baseOnBalls;
    sumOfHBP += hitters[i].stat.hitByPitch;
    sumOfSF += hitters[i].stat.sacFlies;
    sumOfSO += hitters[i].stat.strikeOuts;
    sumOfPA += hitters[i].stat.plateAppearances;
    sumOfAB += hitters[i].stat.atBats;
  }
  return {
    avg: (sumOfH / sumOfAB).toFixed(3).replace(/^0\./, "."),
    obp: (
      (sumOfH + sumOfBB + sumOfHBP) /
      (sumOfAB + sumOfBB + sumOfHBP + sumOfSF)
    )
      .toFixed(3)
      .replace(/^0\./, "."),
    slg: (
      (sumOfH -
        sumOf2B -
        sumOf3B -
        sumOfHR +
        2 * sumOf2B +
        3 * sumOf3B +
        4 * sumOfHR) /
      sumOfAB
    )
      .toFixed(3)
      .replace(/^0\./, "."),
    ops: (
      (sumOfH + sumOfBB + sumOfHBP) / (sumOfAB + sumOfBB + sumOfHBP + sumOfSF) +
      (sumOfH -
        sumOf2B -
        sumOf3B -
        sumOfHR +
        2 * sumOf2B +
        3 * sumOf3B +
        4 * sumOfHR) /
        sumOfAB
    )
      .toFixed(3)
      .replace(/^0\./, "."),
    runs: 100 * (sumOfR / sumOfPA),
    hits: 100 * (sumOfH / sumOfPA),
    doubles: 100 * (sumOf2B / sumOfPA),
    triples: 100 * (sumOf3B / sumOfPA),
    homeRuns: 100 * (sumOfHR / sumOfPA),
    rbi: 100 * (sumOfRBI / sumOfPA),
    baseOnBalls: 100 * (sumOfBB / sumOfPA),
    strikeOuts: 100 * (sumOfSO / sumOfPA),
  };
};

export const calculateHitterExtremes = (hitters: Hitter[]) => {
  const findExtremes = (
    statKey: keyof Hitter["stat"],
    isRate: boolean = false
  ) => {
    const values = hitters.map((hitter) => {
      if (!hitter.stat || !(statKey in hitter.stat)) {
        console.warn(`Property ${statKey} not found in hitter.stat`);
        return 0;
      }

      if (isRate) {
        return Number(hitter.stat[statKey]) / hitter.stat.plateAppearances;
      }
      return typeof hitter.stat[statKey] === "string"
        ? parseFloat(hitter.stat[statKey] as string)
        : Number(hitter.stat[statKey]);
    });

    if (values.length === 0) return { highest: 0, lowest: 0 };

    const highest = hitters[values.indexOf(Math.max(...values))];
    const lowest = hitters[values.indexOf(Math.min(...values))];

    if (!highest || !lowest) return { highest: 0, lowest: 0 };

    if (isRate) {
      return {
        highest:
          (100 * Number(highest.stat[statKey])) / highest.stat.plateAppearances,
        lowest:
          (100 * Number(lowest.stat[statKey])) / lowest.stat.plateAppearances,
      };
    }

    if (["avg", "obp", "slg", "ops"].includes(statKey)) {
      return {
        highest: highest.stat[statKey] as string,
        lowest: lowest.stat[statKey] as string,
      };
    }

    return {
      highest: Number(highest.stat[statKey]),
      lowest: Number(lowest.stat[statKey]),
    };
  };

  const results = {
    avg: findExtremes("avg") as { highest: string; lowest: string },
    obp: findExtremes("obp") as { highest: string; lowest: string },
    slg: findExtremes("slg") as { highest: string; lowest: string },
    ops: findExtremes("ops") as { highest: string; lowest: string },
    runs: findExtremes("runs", true) as { highest: number; lowest: number },
    hits: findExtremes("hits", true) as { highest: number; lowest: number },
    doubles: findExtremes("doubles", true) as {
      highest: number;
      lowest: number;
    },
    triples: findExtremes("triples", true) as {
      highest: number;
      lowest: number;
    },
    homeRuns: findExtremes("homeRuns", true) as {
      highest: number;
      lowest: number;
    },
    rbi: findExtremes("rbi", true) as { highest: number; lowest: number },
    baseOnBalls: findExtremes("baseOnBalls", true) as {
      highest: number;
      lowest: number;
    },
    strikeOuts: findExtremes("strikeOuts", true) as {
      highest: number;
      lowest: number;
    },
  };

  return results;
};
