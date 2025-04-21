import { useState, useEffect } from "react";
import { fetchQualifiedHitters } from "../../services/hittersApi";
import {
  calculateHitterAverages,
  calculateHitterExtremes,
} from "../../utils/hittersCalculations";
import { Hitter } from "../../types/hitting.types";
import { TeamNameAbbreviations } from "../../types/teams.types";
import "./Hitters.css";

export default function Batters() {
  const [fetching, setFetching] = useState(true);
  const [qualifiedHitters, setQualifiedHitters] = useState<Hitter[]>([]);
  const [averages, setAverages] = useState<
    | {
        avg: string;
        obp: string;
        slg: string;
        ops: string;
      }
    | undefined
  >();
  const [extremes, setExtremes] = useState<
    | {
        highestAvg: string;
        lowestAvg: string;
        highestObp: string;
        lowestObp: string;
        highestSlg: string;
        lowestSlg: string;
        highestOps: string;
        lowestOps: string;
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

  if (!fetching)
    return (
      <>
        <button onClick={() => console.log(qualifiedHitters)}>
          get batters
        </button>
        <button onClick={() => calculateHitterExtremes(qualifiedHitters)}>
          hello world
        </button>
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
                <th scope="col" className="pinned stat number sb">
                  SB
                </th>
                <th scope="col" className="pinned stat number cs">
                  CS
                </th>
              </tr>
              <tr className="averages">
                <th scope="col" className="pinned double-pinned rank"></th>
                <th scope="col" className="pinned double-pinned name">
                  AVERAGES
                </th>
                <th scope="col" className="pinned double-pinned team">
                  MLB
                </th>
                <th scope="col" className="pinned stat string avg">
                  {averages ? averages.avg : "-"}
                </th>
                <th scope="col" className="pinned stat string obp">
                  {averages ? averages.obp : "-"}
                </th>
                <th scope="col" className="pinned stat string slg">
                  {averages ? averages.slg : "-"}
                </th>
                <th scope="col" className="pinned stat string ops">
                  {averages ? averages.ops : "-"}
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
                <th scope="col" className="pinned stat number sb">
                  SB
                </th>
                <th scope="col" className="pinned stat number cs">
                  CS
                </th>
              </tr>
            </thead>
            {averages && extremes && (
              <tbody>
                {qualifiedHitters.map((hitter, i) => (
                  <tr key={hitter.player.id}>
                    <th className="pinned rank">{i + 1}</th>
                    <th className="pinned name">
                      {hitter.player.lastName}, {hitter.player.firstName}
                    </th>
                    <th className="pinned team">
                      {TeamNameAbbreviations[hitter.team.name]}
                    </th>
                    <td
                      className="stat string avg"
                      style={
                        Number(hitter.stat.avg) > Number(averages.avg)
                          ? {
                              backgroundColor: `rgba(255, 0, 0, ${
                                (Number(hitter.stat.avg) -
                                  Number(averages.avg)) /
                                (Number(extremes.highestAvg) -
                                  Number(extremes.lowestAvg))
                              })`,
                            }
                          : Number(hitter.stat.avg) < Number(averages.avg)
                          ? {
                              backgroundColor: `rgba(0, 0, 255, ${
                                (Number(averages.avg) -
                                  Number(hitter.stat.avg)) /
                                (Number(extremes.highestAvg) -
                                  Number(extremes.lowestAvg))
                              })`,
                            }
                          : { backgroundColor: "#ffffff" }
                      }
                    >
                      {Math.round(
                        100 +
                          ((Number(hitter.stat.avg) - Number(averages.avg)) /
                            Number(averages.avg)) *
                            100
                      )}
                    </td>
                    {/* <td className="stat string avg">{hitter.stat.avg}</td> */}
                    <td
                      className="stat string obp"
                      style={
                        Number(hitter.stat.obp) > Number(averages.obp)
                          ? {
                              backgroundColor: `rgba(255, 0, 0, ${
                                (Number(hitter.stat.obp) -
                                  Number(averages.obp)) /
                                (Number(extremes.highestObp) -
                                  Number(extremes.lowestObp))
                              })`,
                            }
                          : Number(hitter.stat.obp) < Number(averages.obp)
                          ? {
                              backgroundColor: `rgba(0, 0, 255, ${
                                (Number(averages.obp) -
                                  Number(hitter.stat.obp)) /
                                (Number(extremes.highestObp) -
                                  Number(extremes.lowestObp))
                              })`,
                            }
                          : { backgroundColor: "#ffffff" }
                      }
                    >
                      {Math.round(
                        100 +
                          ((Number(hitter.stat.obp) - Number(averages.obp)) /
                            Number(averages.obp)) *
                            100
                      )}
                    </td>
                    {/* <td className="stat string obp">{hitter.stat.obp}</td> */}
                    <td
                      className="stat string slg"
                      style={
                        Number(hitter.stat.slg) > Number(averages.slg)
                          ? {
                              backgroundColor: `rgba(255, 0, 0, ${
                                (Number(hitter.stat.slg) -
                                  Number(averages.slg)) /
                                (Number(extremes.highestSlg) -
                                  Number(extremes.lowestSlg))
                              })`,
                            }
                          : Number(hitter.stat.slg) < Number(averages.slg)
                          ? {
                              backgroundColor: `rgba(0, 0, 255, ${
                                (Number(averages.slg) -
                                  Number(hitter.stat.slg)) /
                                (Number(extremes.highestSlg) -
                                  Number(extremes.lowestSlg))
                              })`,
                            }
                          : { backgroundColor: "#ffffff" }
                      }
                    >
                      {Math.round(
                        100 +
                          ((Number(hitter.stat.slg) - Number(averages.slg)) /
                            Number(averages.slg)) *
                            100
                      )}
                    </td>
                    {/* <td className="stat string slg">{hitter.stat.slg}</td> */}
                    <td
                      className="stat string ops"
                      style={
                        Number(hitter.stat.ops) > Number(averages.ops)
                          ? {
                              backgroundColor: `rgba(255, 0, 0, ${
                                (Number(hitter.stat.ops) -
                                  Number(averages.ops)) /
                                (Number(extremes.highestOps) -
                                  Number(extremes.lowestOps))
                              })`,
                            }
                          : Number(hitter.stat.ops) < Number(averages.ops)
                          ? {
                              backgroundColor: `rgba(0, 0, 255, ${
                                (Number(averages.ops) -
                                  Number(hitter.stat.ops)) /
                                (Number(extremes.highestOps) -
                                  Number(extremes.lowestOps))
                              })`,
                            }
                          : { backgroundColor: "#ffffff" }
                      }
                    >
                      {Math.round(
                        100 +
                          ((Number(hitter.stat.ops) - Number(averages.ops)) /
                            Number(averages.ops)) *
                            100
                      )}
                    </td>
                    {/* <td className="stat string ops">{hitter.stat.ops}</td> */}
                    <td className="stat number r">{hitter.stat.runs}</td>
                    <td className="stat number h">{hitter.stat.hits}</td>
                    <td className="stat number 2b">{hitter.stat.doubles}</td>
                    <td className="stat number 3b">{hitter.stat.triples}</td>
                    <td className="stat number hr">{hitter.stat.homeRuns}</td>
                    <td className="stat number rbi">{hitter.stat.rbi}</td>
                    <td className="stat number bb">
                      {hitter.stat.baseOnBalls}
                    </td>
                    <td className="stat number so">{hitter.stat.strikeOuts}</td>
                    <td className="stat number sb">
                      {hitter.stat.stolenBases}
                    </td>
                    <td className="stat number cs">
                      {hitter.stat.caughtStealing}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </>
    );
}
