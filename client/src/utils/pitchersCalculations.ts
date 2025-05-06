import {
  Pitcher,
  PitcherAverages,
  PitcherExtremes,
} from "../types/pitching.types";

export function convertInningsPitchedToNumber(inningsPitched: string): number {
  const parts = inningsPitched.split(".");
  const wholeInnings = parseInt(parts[0], 10);
  if (parts.length > 1) {
    const fractionPart = parseInt(parts[1], 10);
    return wholeInnings + fractionPart / 3;
  }
  return wholeInnings;
}

export const calculatePitcherAverages = (pitchers: Pitcher[]) => {
  let sumOfAirOuts = 0;
  let sumOfAtBats = 0;
  let sumOfBaseOnBalls = 0;
  let sumOfEarnedRuns = 0;
  let sumOfGames = 0;
  let sumOfGroundOuts = 0;
  let sumOfHits = 0;
  let sumOfHomeRuns = 0;
  let sumOfInningsPitched = 0;
  let sumOfNumberOfPitches = 0;
  let sumOfStrikeOuts = 0;
  let sumOfStrikes = 0;
  for (let i = 0; i < pitchers.length; i++) {
    sumOfAirOuts += pitchers[i].stat.airOuts;
    sumOfAtBats += pitchers[i].stat.atBats;
    sumOfBaseOnBalls += pitchers[i].stat.baseOnBalls;
    sumOfEarnedRuns += pitchers[i].stat.earnedRuns;
    sumOfGames += pitchers[i].stat.gamesPlayed;
    sumOfGroundOuts += pitchers[i].stat.groundOuts;
    sumOfHits += pitchers[i].stat.hits;
    sumOfHomeRuns += pitchers[i].stat.homeRuns;
    sumOfInningsPitched += convertInningsPitchedToNumber(
      pitchers[i].stat.inningsPitched
    );
    sumOfNumberOfPitches += pitchers[i].stat.numberOfPitches;
    sumOfStrikeOuts += pitchers[i].stat.strikeOuts;
    sumOfStrikes += pitchers[i].stat.strikes;
  }
  return {
    era: (9 * sumOfEarnedRuns) / sumOfInningsPitched,
    whip: (sumOfHits + sumOfBaseOnBalls) / sumOfInningsPitched,
    avg: sumOfHits / sumOfAtBats,
    innPerGame: sumOfInningsPitched / sumOfGames,
    strikeOutsPer9Inn: (9 * sumOfStrikeOuts) / sumOfInningsPitched,
    walksPer9Inn: (9 * sumOfBaseOnBalls) / sumOfInningsPitched,
    hitsPer9Inn: (9 * sumOfHits) / sumOfInningsPitched,
    homeRunsPer9: (9 * sumOfHomeRuns) / sumOfInningsPitched,
    strikeoutWalkRatio: sumOfStrikeOuts / sumOfBaseOnBalls,
    groundOutsToAirouts: sumOfGroundOuts / sumOfAirOuts,
    strikeBallRatio: sumOfStrikes / (sumOfNumberOfPitches - sumOfStrikes),
    pitchesPer9Inn: (9 * sumOfNumberOfPitches) / sumOfInningsPitched,
  };
};

export const calculatePitcherExtremes = (pitchers: Pitcher[]) => {
  return pitchers.reduce(
    (extremes, pitcher) => {
      const updateExtremes = (stat: keyof typeof extremes, value: number) => {
        extremes[stat].highest = Math.max(extremes[stat].highest, value);
        extremes[stat].lowest = Math.min(extremes[stat].lowest, value);
      };
      const era =
        (9 * pitcher.stat.earnedRuns) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
      const whip =
        (pitcher.stat.hits + pitcher.stat.baseOnBalls) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
      const avg = pitcher.stat.hits / pitcher.stat.atBats;
      const innPerGame =
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched) /
        pitcher.stat.gamesPlayed;
      const strikeOutsPer9Inn =
        (9 * pitcher.stat.strikeOuts) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
      const walksPer9Inn =
        (9 * pitcher.stat.baseOnBalls) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
      const hitsPer9Inn =
        (9 * pitcher.stat.hits) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
      const homeRunsPer9 =
        (9 * pitcher.stat.homeRuns) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
      const strikeoutWalkRatio =
        pitcher.stat.strikeOuts / pitcher.stat.baseOnBalls;
      const groundOutsToAirouts =
        pitcher.stat.groundOuts / pitcher.stat.airOuts;
      const strikeBallRatio =
        pitcher.stat.strikes /
        (pitcher.stat.numberOfPitches - pitcher.stat.strikes);
      const pitchesPer9Inn =
        (9 * pitcher.stat.numberOfPitches) /
        convertInningsPitchedToNumber(pitcher.stat.inningsPitched);

      updateExtremes("era", era);
      updateExtremes("whip", whip);
      updateExtremes("avg", avg);
      updateExtremes("innPerGame", innPerGame);
      updateExtremes("strikeOutsPer9Inn", strikeOutsPer9Inn);
      updateExtremes("walksPer9Inn", walksPer9Inn);
      updateExtremes("hitsPer9Inn", hitsPer9Inn);
      updateExtremes("homeRunsPer9", homeRunsPer9);
      updateExtremes("strikeoutWalkRatio", strikeoutWalkRatio);
      updateExtremes("groundOutsToAirouts", groundOutsToAirouts);
      updateExtremes("strikeBallRatio", strikeBallRatio);
      updateExtremes("pitchesPer9Inn", pitchesPer9Inn);

      return extremes;
    },
    {
      era: { highest: 0, lowest: 0 },
      whip: { highest: 0, lowest: 0 },
      avg: { highest: 0, lowest: 0 },
      innPerGame: { highest: 0, lowest: 0 },
      strikeOutsPer9Inn: { highest: 0, lowest: 0 },
      walksPer9Inn: { highest: 0, lowest: 0 },
      hitsPer9Inn: { highest: 0, lowest: 0 },
      homeRunsPer9: { highest: 0, lowest: 0 },
      strikeoutWalkRatio: { highest: 0, lowest: 0 },
      groundOutsToAirouts: { highest: 0, lowest: 0 },
      strikeBallRatio: { highest: 0, lowest: 0 },
      pitchesPer9Inn: { highest: 0, lowest: 0 },
    }
  );
};

export const calculatePitcherNormalizedStats = (
  pitcher: Pitcher,
  averages: PitcherAverages
) => {
  const era =
    (9 * pitcher.stat.earnedRuns) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const whip =
    (pitcher.stat.hits + pitcher.stat.baseOnBalls) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const avg = pitcher.stat.hits / pitcher.stat.atBats;
  const innPerGame =
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched) /
    pitcher.stat.gamesPlayed;
  const strikeOutsPer9Inn =
    (9 * pitcher.stat.strikeOuts) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const walksPer9Inn =
    (9 * pitcher.stat.baseOnBalls) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const hitsPer9Inn =
    (9 * pitcher.stat.hits) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const homeRunsPer9 =
    (9 * pitcher.stat.homeRuns) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const strikeoutWalkRatio = pitcher.stat.strikeOuts / pitcher.stat.baseOnBalls;
  const groundOutsToAirouts = pitcher.stat.groundOuts / pitcher.stat.airOuts;
  const strikeBallRatio =
    pitcher.stat.strikes /
    (pitcher.stat.numberOfPitches - pitcher.stat.strikes);
  const pitchesPer9Inn =
    (9 * pitcher.stat.numberOfPitches) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);

  return {
    era: era === averages.era ? 100 : (100 * averages.era) / era,
    whip: whip === averages.whip ? 100 : (100 * averages.whip) / whip,
    avg: avg === averages.avg ? 100 : (100 * averages.avg) / avg,
    innPerGame:
      innPerGame === averages.innPerGame
        ? 100
        : (100 * innPerGame) / averages.innPerGame,
    strikeOutsPer9Inn:
      strikeOutsPer9Inn === averages.strikeOutsPer9Inn
        ? 100
        : (100 * strikeOutsPer9Inn) / averages.strikeOutsPer9Inn,
    walksPer9Inn:
      walksPer9Inn === averages.walksPer9Inn
        ? 100
        : (100 * averages.walksPer9Inn) / walksPer9Inn,
    hitsPer9Inn:
      hitsPer9Inn === averages.hitsPer9Inn
        ? 100
        : (100 * averages.hitsPer9Inn) / hitsPer9Inn,
    homeRunsPer9:
      homeRunsPer9 === averages.homeRunsPer9
        ? 100
        : (100 * averages.homeRunsPer9) / homeRunsPer9,
    strikeoutWalkRatio:
      strikeoutWalkRatio === averages.strikeoutWalkRatio
        ? 100
        : (100 * strikeoutWalkRatio) / averages.strikeoutWalkRatio,
    groundOutsToAirouts:
      groundOutsToAirouts === averages.groundOutsToAirouts
        ? 100
        : (100 * groundOutsToAirouts) / averages.groundOutsToAirouts,
    strikeBallRatio:
      strikeBallRatio === averages.strikeBallRatio
        ? 100
        : (100 * strikeBallRatio) / averages.strikeBallRatio,
    pitchesPer9Inn:
      pitchesPer9Inn === averages.pitchesPer9Inn
        ? 100
        : (100 * averages.pitchesPer9Inn) / pitchesPer9Inn,
  };
};

export const calculatePitcherBackgroundOpacities = (
  pitcher: Pitcher,
  averages: PitcherAverages,
  extremes: PitcherExtremes
) => {
  const era =
    (9 * pitcher.stat.earnedRuns) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const whip =
    (pitcher.stat.hits + pitcher.stat.baseOnBalls) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const avg = pitcher.stat.hits / pitcher.stat.atBats;
  const innPerGame =
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched) /
    pitcher.stat.gamesPlayed;
  const strikeOutsPer9Inn =
    (9 * pitcher.stat.strikeOuts) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const walksPer9Inn =
    (9 * pitcher.stat.baseOnBalls) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const hitsPer9Inn =
    (9 * pitcher.stat.hits) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const homeRunsPer9 =
    (9 * pitcher.stat.homeRuns) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);
  const strikeoutWalkRatio = pitcher.stat.strikeOuts / pitcher.stat.baseOnBalls;
  const groundOutsToAirouts = pitcher.stat.groundOuts / pitcher.stat.airOuts;
  const strikeBallRatio =
    pitcher.stat.strikes /
    (pitcher.stat.numberOfPitches - pitcher.stat.strikes);
  const pitchesPer9Inn =
    (9 * pitcher.stat.numberOfPitches) /
    convertInningsPitchedToNumber(pitcher.stat.inningsPitched);

  return {
    era: Math.abs(
      (era - averages.era) / (extremes.era.highest - extremes.era.lowest)
    ),
    whip: Math.abs(
      (whip - averages.whip) / (extremes.whip.highest - extremes.whip.lowest)
    ),
    avg: Math.abs(
      (avg - averages.avg) / (extremes.avg.highest - extremes.avg.lowest)
    ),
    innPerGame: Math.abs(
      (innPerGame - averages.innPerGame) /
        (extremes.innPerGame.highest - extremes.innPerGame.lowest)
    ),
    strikeOutsPer9Inn: Math.abs(
      (strikeOutsPer9Inn - averages.strikeOutsPer9Inn) /
        (extremes.strikeOutsPer9Inn.highest - extremes.strikeOutsPer9Inn.lowest)
    ),
    walksPer9Inn: Math.abs(
      (walksPer9Inn - averages.walksPer9Inn) /
        (extremes.walksPer9Inn.highest - extremes.walksPer9Inn.lowest)
    ),
    hitsPer9Inn: Math.abs(
      (hitsPer9Inn - averages.hitsPer9Inn) /
        (extremes.hitsPer9Inn.highest - extremes.hitsPer9Inn.lowest)
    ),
    homeRunsPer9: Math.abs(
      (homeRunsPer9 - averages.homeRunsPer9) /
        (extremes.homeRunsPer9.highest - extremes.homeRunsPer9.lowest)
    ),
    strikeoutWalkRatio: Math.abs(
      (strikeoutWalkRatio - averages.strikeoutWalkRatio) /
        (extremes.strikeoutWalkRatio.highest -
          extremes.strikeoutWalkRatio.lowest)
    ),
    groundOutsToAirouts: Math.abs(
      (groundOutsToAirouts - averages.groundOutsToAirouts) /
        (extremes.groundOutsToAirouts.highest -
          extremes.groundOutsToAirouts.lowest)
    ),
    strikeBallRatio: Math.abs(
      (strikeBallRatio - averages.strikeBallRatio) /
        (extremes.strikeBallRatio.highest - extremes.strikeBallRatio.lowest)
    ),
    pitchesPer9Inn: Math.abs(
      (pitchesPer9Inn - averages.pitchesPer9Inn) /
        (extremes.pitchesPer9Inn.highest - extremes.pitchesPer9Inn.lowest)
    ),
  };
};

export const sortPitchersByStat = (
  pitchers: Pitcher[],
  stat: keyof PitcherAverages,
  filterMethod: "highToLow" | "lowToHigh"
) => {
  const allPitcherStats = [];
  for (let i = 0; i < pitchers.length; i++) {
    const inningsPitched = convertInningsPitchedToNumber(
      pitchers[i].stat.inningsPitched
    );

    allPitcherStats.push({
      id: pitchers[i].player.id,
      era: (9 * pitchers[i].stat.earnedRuns) / inningsPitched,
      whip:
        (pitchers[i].stat.hits + pitchers[i].stat.baseOnBalls) / inningsPitched,
      avg: pitchers[i].stat.hits / pitchers[i].stat.atBats,
      innPerGame: inningsPitched / pitchers[i].stat.gamesPlayed,
      strikeOutsPer9Inn: (9 * pitchers[i].stat.strikeOuts) / inningsPitched,
      walksPer9Inn: (9 * pitchers[i].stat.baseOnBalls) / inningsPitched,
      hitsPer9Inn: (9 * pitchers[i].stat.hits) / inningsPitched,
      homeRunsPer9: (9 * pitchers[i].stat.homeRuns) / inningsPitched,
      strikeoutWalkRatio:
        pitchers[i].stat.strikeOuts / pitchers[i].stat.baseOnBalls,
      groundOutsToAirouts:
        pitchers[i].stat.groundOuts / pitchers[i].stat.airOuts,
      strikeBallRatio:
        pitchers[i].stat.strikes /
        (pitchers[i].stat.numberOfPitches - pitchers[i].stat.strikes),
      pitchesPer9Inn: (9 * pitchers[i].stat.numberOfPitches) / inningsPitched,
    });
  }

  allPitcherStats.sort((a, b) => {
    const invertSort = [
      "era",
      "whip",
      "avg",
      "walksPer9Inn",
      "hitsPer9Inn",
      "homeRunsPer9",
      "pitchesPer9Inn",
    ].includes(stat);

    if (filterMethod === "highToLow") {
      return invertSort ? a[stat] - b[stat] : b[stat] - a[stat];
    } else {
      return invertSort ? b[stat] - a[stat] : a[stat] - b[stat];
    }
  });

  const sortedPitchers = allPitcherStats.map((statObj) => {
    return pitchers.find((pitcher) => pitcher.player.id === statObj.id);
  });

  return sortedPitchers;
};

export const calculateMostAveragePitcher = (
  pitchers: Pitcher[],
  averages: PitcherAverages,
  season: number,
  dataset: string
) => {
  const totals = [];
  for (let i = 0; i < pitchers.length; i++) {
    const inningsPitched = convertInningsPitchedToNumber(
      pitchers[i].stat.inningsPitched
    );

    const era = (9 * pitchers[i].stat.earnedRuns) / inningsPitched;
    const whip =
      (pitchers[i].stat.hits + pitchers[i].stat.baseOnBalls) / inningsPitched;
    const avg = pitchers[i].stat.hits / pitchers[i].stat.atBats;
    const innPerGame = inningsPitched / pitchers[i].stat.gamesPlayed;
    const strikeOutsPer9Inn =
      (9 * pitchers[i].stat.strikeOuts) / inningsPitched;
    const walksPer9Inn = (9 * pitchers[i].stat.baseOnBalls) / inningsPitched;
    const hitsPer9Inn = (9 * pitchers[i].stat.hits) / inningsPitched;
    const homeRunsPer9 = (9 * pitchers[i].stat.homeRuns) / inningsPitched;
    const strikeoutWalkRatio =
      pitchers[i].stat.strikeOuts / pitchers[i].stat.baseOnBalls;
    const groundOutsToAirouts =
      pitchers[i].stat.groundOuts / pitchers[i].stat.airOuts;
    const strikeBallRatio =
      pitchers[i].stat.strikes /
      (pitchers[i].stat.numberOfPitches - pitchers[i].stat.strikes);
    const pitchesPer9Inn =
      (9 * pitchers[i].stat.numberOfPitches) / inningsPitched;

    const totalDeviation =
      Math.abs((era - averages.era) / averages.era) +
      Math.abs((whip - averages.whip) / averages.whip) +
      Math.abs((avg - averages.avg) / averages.avg) +
      (dataset === "qualified"
        ? Math.abs((innPerGame - averages.innPerGame) / averages.innPerGame)
        : 0) +
      Math.abs(
        (strikeOutsPer9Inn - averages.strikeOutsPer9Inn) /
          averages.strikeOutsPer9Inn
      ) +
      Math.abs((walksPer9Inn - averages.walksPer9Inn) / averages.walksPer9Inn) +
      Math.abs((hitsPer9Inn - averages.hitsPer9Inn) / averages.hitsPer9Inn) +
      Math.abs((homeRunsPer9 - averages.homeRunsPer9) / averages.homeRunsPer9) +
      Math.abs(
        (strikeoutWalkRatio - averages.strikeoutWalkRatio) /
          averages.strikeoutWalkRatio
      ) +
      (season > 1973
        ? Math.abs(
            (groundOutsToAirouts - averages.groundOutsToAirouts) /
              averages.groundOutsToAirouts
          )
        : 0) +
      (season > 1973
        ? Math.abs(
            (strikeBallRatio - averages.strikeBallRatio) /
              averages.strikeBallRatio
          )
        : 0) +
      (season > 1973
        ? Math.abs(
            (pitchesPer9Inn - averages.pitchesPer9Inn) / averages.pitchesPer9Inn
          )
        : 0);

    totals.push({
      name: pitchers[i].player.fullName,
      averageAbsoluteDeviation:
        (100 * totalDeviation) /
        (season > 1973
          ? dataset === "qualified"
            ? 12
            : 11
          : dataset === "qualified"
          ? 9
          : 8),
    });
  }

  const sorted = [...totals].sort(
    (a, b) => a.averageAbsoluteDeviation - b.averageAbsoluteDeviation
  );
  return sorted[0];
};
