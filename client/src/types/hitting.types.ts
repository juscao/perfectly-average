export type Hitter = {
  season: string;
  stat: {
    gamesPlayed: number;
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
    plateAppearances: number;
    totalBases: number;
    rbi: number;
    leftOnBase: number;
    sacBunts: number;
    sacFlies: number;
    babip: string;
    groundOutsToAirouts: string;
    catchersInterference: number;
    atBatsPerHomeRun: string;
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
