import { useState, useEffect } from "react";
import { fetchQualifiedHitters } from "../../services/hittersApi";
import {
  calculateHitterAverages,
  calculateHitterExtremes,
} from "../../utils/hittersCalculations";
import { Hitter } from "../../types/hitting.types";
import { TeamNameAbbreviations, TeamColors } from "../../types/teams.types";
import "./Hitters.css";

type StatCellProps = {
  hitter: Hitter;
  statName: keyof Hitter["stat"];
  average: string | number;
  extreme: { lowest: string | number; highest: string | number };
  isRate?: boolean;
  isReversed?: boolean;
  className: string;
};

const StatCell = ({
  hitter,
  statName,
  average,
  extreme,
  isRate = false,
  isReversed = false,
  className,
}: StatCellProps) => {
  const getValue = () => {
    if (isRate) {
      return (
        (100 * Number(hitter.stat[statName])) / hitter.stat.plateAppearances
      );
    }
    return Number(hitter.stat[statName]);
  };

  const value = getValue();
  const avg = Number(average);
  const isAboveAverage = value > avg;

  const opacity =
    (value - avg) / (Number(extreme.highest) - Number(extreme.lowest));
  const absoluteOpacity = Math.abs(opacity);

  const backgroundColor = isReversed
    ? isAboveAverage
      ? `rgba(0, 0, 255, ${absoluteOpacity})`
      : `rgba(255, 0, 0, ${absoluteOpacity})`
    : isAboveAverage
    ? `rgba(255, 0, 0, ${absoluteOpacity})`
    : `rgba(0, 0, 255, ${absoluteOpacity})`;

  const isBlueBackground = isReversed ? isAboveAverage : !isAboveAverage;

  const textColor =
    value === avg
      ? "rgb(0, 0, 0)"
      : isBlueBackground && absoluteOpacity > 0.5
      ? "rgb(255, 255, 255)"
      : "rgb(0, 0, 0)";

  const normalized = Math.round(100 + ((value - avg) / avg) * 100);

  return (
    <td
      className={`stat ${className}`}
      style={{
        backgroundColor: value === avg ? "#ffffff" : backgroundColor,
        color: textColor,
      }}
    >
      {normalized}
    </td>
  );
};

export default function Hitters() {
  const [fetching, setFetching] = useState(true);
  const [qualifiedHitters, setQualifiedHitters] = useState<Hitter[]>([]);
  const [averages, setAverages] = useState<
    | {
        avg: string;
        obp: string;
        slg: string;
        ops: string;
        runs: number;
        hits: number;
        doubles: number;
        triples: number;
        homeRuns: number;
        rbi: number;
        baseOnBalls: number;
        strikeOuts: number;
      }
    | undefined
  >();
  const [extremes, setExtremes] = useState<
    | {
        avg: { lowest: string; highest: string };
        obp: { lowest: string; highest: string };
        slg: { lowest: string; highest: string };
        ops: { lowest: string; highest: string };
        runs: { lowest: number; highest: number };
        hits: { lowest: number; highest: number };
        doubles: { lowest: number; highest: number };
        triples: { lowest: number; highest: number };
        homeRuns: { lowest: number; highest: number };
        rbi: { lowest: number; highest: number };
        baseOnBalls: { lowest: number; highest: number };
        strikeOuts: { lowest: number; highest: number };
      }
    | undefined
  >();

  useEffect(() => {
    const getHitters = async () => {
      const response = await fetchQualifiedHitters(2025);
      if (response) {
        const hitterAverages = calculateHitterAverages(response);
        setAverages(hitterAverages);
        const hitterExtremes = calculateHitterExtremes(response);
        setExtremes(hitterExtremes);
        const sortedData: Hitter[] = [...response].sort((a, b) =>
          a.player.lastName.localeCompare(b.player.lastName)
        );
        setQualifiedHitters(sortedData);
      }
      setFetching(false);
    };
    getHitters();
  }, []);

  if (!fetching && averages && extremes)
    return (
      <>
        <button onClick={() => console.log(qualifiedHitters)}>
          get hitters
        </button>
        <button>hello world</button>
        <>
          <p>
            R, H, 2B, 3B, HR, RBI, BB, SO, SB, and CS averages are calculated
            per 100 plate appearances (e.g., on average, a qualified hitter will
            have {averages.hits.toFixed(2)} hits per 100 PA).
          </p>
          <p>
            Red is good and blue is bad. For SO, lower is better. Higher is
            better for the rest.
          </p>
        </>
        <div id="table-container">
          <table id="hitting-table">
            <thead>
              <tr className="headings">
                <th scope="col" className="pinned double-pinned rank">
                  Rank
                </th>
                <th scope="col" className="pinned double-pinned name">
                  Name
                </th>
                <th scope="col" className="pinned double-pinned position">
                  Pos
                </th>
                <th scope="col" className="pinned double-pinned team">
                  Team
                </th>
                <th scope="col" className="pinned stat string avg">
                  AVG
                </th>
                <th scope="col" className="pinned stat string obp">
                  OBP
                </th>
                <th scope="col" className="pinned stat string slg">
                  SLG
                </th>
                <th scope="col" className="pinned stat string ops">
                  OPS
                </th>
                <th scope="col" className="pinned stat number r">
                  R
                </th>
                <th scope="col" className="pinned stat number h">
                  H
                </th>
                <th scope="col" className="pinned stat number 2b">
                  2B
                </th>
                <th scope="col" className="pinned stat number 3b">
                  3B
                </th>
                <th scope="col" className="pinned stat number hr">
                  HR
                </th>
                <th scope="col" className="pinned stat number rbi">
                  RBI
                </th>
                <th scope="col" className="pinned stat number bb">
                  BB
                </th>
                <th scope="col" className="pinned stat number so">
                  SO
                </th>
              </tr>

              <tr className="averages">
                <th scope="col" className="pinned double-pinned rank"></th>
                <th scope="col" className="pinned double-pinned name">
                  AVERAGES
                </th>
                <th scope="col" className="pinned double-pinned position"></th>
                <th scope="col" className="pinned double-pinned team">
                  MLB
                </th>
                <th scope="col" className="pinned stat string avg">
                  {averages.avg}
                </th>
                <th scope="col" className="pinned stat string obp">
                  {averages.obp}
                </th>
                <th scope="col" className="pinned stat string slg">
                  {averages.slg}
                </th>
                <th scope="col" className="pinned stat string ops">
                  {averages.ops}
                </th>
                <th scope="col" className="pinned stat number r">
                  {averages.runs.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number h">
                  {averages.hits.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number 2b">
                  {averages.doubles.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number 3b">
                  {averages.triples.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number hr">
                  {averages.homeRuns.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number rbi">
                  {averages.rbi.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number bb">
                  {averages.baseOnBalls.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number so">
                  {averages.strikeOuts.toFixed(2)}
                </th>
              </tr>
            </thead>
            <tbody>
              {qualifiedHitters.map((hitter, i) => (
                <tr key={hitter.player.id}>
                  <th className="pinned rank">{i + 1}</th>
                  <th className="pinned name">
                    {hitter.player.lastName}, {hitter.player.firstName}
                  </th>
                  <th className="pinned position">
                    {hitter.position.abbreviation}
                  </th>
                  <th
                    className="pinned team"
                    style={{
                      backgroundColor: `${
                        TeamColors[hitter.team.name].background
                      }`,
                      color: `${TeamColors[hitter.team.name].text}`,
                    }}
                  >
                    {TeamNameAbbreviations[hitter.team.name]}
                  </th>
                  <StatCell
                    hitter={hitter}
                    statName="avg"
                    average={averages.avg}
                    extreme={extremes.avg}
                    className="string avg"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="obp"
                    average={averages.obp}
                    extreme={extremes.obp}
                    className="string obp"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="slg"
                    average={averages.slg}
                    extreme={extremes.slg}
                    className="string slg"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="ops"
                    average={averages.ops}
                    extreme={extremes.ops}
                    className="string ops"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="runs"
                    average={averages.runs}
                    extreme={extremes.runs}
                    isRate={true}
                    className="number r"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="hits"
                    average={averages.hits}
                    extreme={extremes.hits}
                    isRate={true}
                    className="number h"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="doubles"
                    average={averages.doubles}
                    extreme={extremes.doubles}
                    isRate={true}
                    className="number 2b"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="triples"
                    average={averages.triples}
                    extreme={extremes.triples}
                    isRate={true}
                    className="number 3b"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="homeRuns"
                    average={averages.homeRuns}
                    extreme={extremes.homeRuns}
                    isRate={true}
                    className="number hr"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="rbi"
                    average={averages.rbi}
                    extreme={extremes.rbi}
                    isRate={true}
                    className="number rbi"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="baseOnBalls"
                    average={averages.baseOnBalls}
                    extreme={extremes.baseOnBalls}
                    isRate={true}
                    className="number bb"
                  />
                  <StatCell
                    hitter={hitter}
                    statName="strikeOuts"
                    average={averages.strikeOuts}
                    extreme={extremes.strikeOuts}
                    isRate={true}
                    isReversed={true}
                    className="number so"
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
}
