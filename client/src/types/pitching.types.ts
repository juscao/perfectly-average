export type Pitcher = {
  season: string;
  stat: {
    gamesPlayed: number;
    gamesStarted: number;
    groundOuts: number;
    airOuts: number;
    runs: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    strikeOuts: number;
    baseOnBalls: number;
    intentionalWalks: number;
    hits: number;
    hitByPitch: number;
    avg: string;
    atBats: number;
    obp: string;
    slg: string;
    ops: string;
    caughtStealing: number;
    stolenBases: number;
    stolenBasePercentage: string;
    groundIntoDoublePlay: number;
    numberOfPitches: number;
    era: string;
    inningsPitched: string;
    wins: number;
    losses: number;
    saves: number;
    saveOpportunities: number;
    holds: number;
    blownSaves: number;
    earnedRuns: number;
    whip: string;
    battersFaced: number;
    outs: number;
    gamesPitched: number;
    completeGames: number;
    shutouts: number;
    strikes: number;
    strikePercentage: string;
    hitBatsmen: number;
    balks: number;
    wildPitches: number;
    pickoffs: number;
    totalBases: number;
    groundOutsToAirouts: string;
    winPercentage: string;
    pitchesPerInning: string;
    gamesFinished: number;
    strikeoutWalkRatio: string;
    strikeoutsPer9Inn: string;
    walksPer9Inn: string;
    hitsPer9Inn: string;
    runsScoredPer9: string;
    homeRunsPer9: string;
    inheritedRunners: number;
    inheritedRunnersScored: number;
    catchersInterference: number;
    sacBunts: number;
    sacFlies: number;
  };
  team: {
    id: number;
    name: string;
    link: string;
  };
  player: {
    id: number;
    fullName: string;
    link: string;
    firstName: string;
    lastName: string;
  };
  league: {
    id: number;
    name: string;
    link: string;
  };
  sport: {
    id: number;
    link: string;
    abbreviation: string;
  };
  numTeams: number;
  rank: number;
  position: {
    code: string;
    name: string;
    type: string;
    abbreviation: string;
  };
};

export type PitcherAverages = {
  era: number;
  whip: number;
  avg: number;
  innPerGame: number;
  strikeOutsPer9Inn: number;
  walksPer9Inn: number;
  hitsPer9Inn: number;
  homeRunsPer9: number;
  strikeoutWalkRatio: number;
  groundOutsToAirouts: number;
  strikeBallRatio: number;
  pitchesPer9Inn: number;
};

export type PitcherExtremes = {
  era: { lowest: number; highest: number };
  whip: { lowest: number; highest: number };
  avg: { lowest: number; highest: number };
  innPerGame: { lowest: number; highest: number };
  strikeOutsPer9Inn: { lowest: number; highest: number };
  walksPer9Inn: { lowest: number; highest: number };
  hitsPer9Inn: { lowest: number; highest: number };
  homeRunsPer9: { lowest: number; highest: number };
  strikeoutWalkRatio: { lowest: number; highest: number };
  groundOutsToAirouts: { lowest: number; highest: number };
  strikeBallRatio: { lowest: number; highest: number };
  pitchesPer9Inn: { lowest: number; highest: number };
};

export type AwardRecipient = {
  id: string;
  name: string;
  date: string;
  season: string;
  team: {
    id: number;
    link: string;
  };
  player: {
    id: number;
    link: string;
    primaryPosition: {
      code: string;
      name: string;
      type: string;
      abbreviation: string;
    };
    nameFirstLast: string;
  };
};
