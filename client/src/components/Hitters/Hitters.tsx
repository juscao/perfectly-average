import { useState, useEffect } from "react";
import { fetchQualifiedHitters } from "../../services/hittersApi";
import { Hitter } from "../../types/hitting.types";
import { TeamNameAbbreviations } from "../../types/teams.types";
import "./Hitters.css";

export default function Batters() {
  const [fetching, setFetching] = useState(true);
  const [qualifiedHitters, setQualifiedHitters] = useState<Hitter[]>([]);

  useEffect(() => {
    const getbatters = async () => {
      const response = await fetchQualifiedHitters(2025);
      if (response) {
        const sortedData: Hitter[] = [...response].sort((a, b) =>
          a.player.lastName.localeCompare(b.player.lastName)
        );
        setQualifiedHitters(sortedData);
      }
      setFetching(false);
    };
    getbatters();
  }, []);

  if (!fetching)
    return (
      <>
        <button onClick={() => console.log(qualifiedHitters)}>
          get batters
        </button>
        <div id="table-container">
          <table id="hitting-table">
            <thead>
              <tr>
                <th scope="col" className="pinned double-pinned rank">
                  Rank
                </th>
                <th scope="col" className="pinned double-pinned name">
                  Name
                </th>
                <th scope="col" className="pinned double-pinned team">
                  Team
                </th>
                <th scope="col" className="pinned stat string">
                  AVG
                </th>
                <th scope="col" className="pinned stat string">
                  OBP
                </th>
                <th scope="col" className="pinned stat string">
                  SLG
                </th>
                <th scope="col" className="pinned stat string">
                  OPS
                </th>
                <th scope="col" className="pinned stat number">
                  R
                </th>
                <th scope="col" className="pinned stat number">
                  H
                </th>
                <th scope="col" className="pinned stat number">
                  2B
                </th>
                <th scope="col" className="pinned stat number">
                  3B
                </th>
                <th scope="col" className="pinned stat number">
                  HR
                </th>
                <th scope="col" className="pinned stat number">
                  RBI
                </th>
                <th scope="col" className="pinned stat number">
                  BB
                </th>
                <th scope="col" className="pinned stat number">
                  SO
                </th>
                <th scope="col" className="pinned stat number">
                  SB
                </th>
                <th scope="col" className="pinned stat number">
                  CS
                </th>
              </tr>
            </thead>
            <tbody>
              {qualifiedHitters.map((hitter, i) => (
                <tr>
                  <th className="pinned rank">{i + 1}</th>
                  <th className="pinned name">
                    {hitter.player.lastName}, {hitter.player.firstName}
                  </th>
                  <th className="pinned team">
                    {TeamNameAbbreviations[hitter.team.name]}
                  </th>
                  <td className="stat string">{hitter.stat.avg}</td>
                  <td className="stat string">{hitter.stat.obp}</td>
                  <td className="stat string">{hitter.stat.slg}</td>
                  <td className="stat string">{hitter.stat.ops}</td>
                  <td className="stat number">{hitter.stat.runs}</td>
                  <td className="stat number">{hitter.stat.hits}</td>
                  <td className="stat number">{hitter.stat.doubles}</td>
                  <td className="stat number">{hitter.stat.triples}</td>
                  <td className="stat number">{hitter.stat.homeRuns}</td>
                  <td className="stat number">{hitter.stat.rbi}</td>
                  <td className="stat number">{hitter.stat.baseOnBalls}</td>
                  <td className="stat number">{hitter.stat.strikeOuts}</td>
                  <td className="stat number">{hitter.stat.stolenBases}</td>
                  <td className="stat number">{hitter.stat.caughtStealing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
}
