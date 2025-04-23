import { useState, useEffect } from "react";
import { HittersRow } from "./HittersRow";
import { fetchQualifiedHitters } from "../../services/hittersApi";
import {
  calculateHitterAverages,
  calculateHitterExtremes,
} from "../../utils/hittersCalculations";
import {
  Hitter,
  HitterAverages,
  HitterExtremes,
} from "../../types/hitting.types";
import "./Hitters.css";

export default function Hitters() {
  const [fetching, setFetching] = useState(true);
  const [qualifiedHitters, setQualifiedHitters] = useState<Hitter[]>([]);
  const [averages, setAverages] = useState<HitterAverages | undefined>();
  const [extremes, setExtremes] = useState<HitterExtremes | undefined>();

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
      <div className="wrapper">
        <h1>Qualified Hitters</h1>
        <div className="description">
          <p>
            R, H, 2B, 3B, HR, RBI, BB, SO, SB, and CS averages are calculated
            per 100 plate appearances (e.g., on average, a qualified hitter will
            have <strong>{averages.hits.toFixed(2)}</strong> hits per 100 PA).
          </p>
          <p>
            Red is good and blue is bad. For SO, lower is better. Higher is
            better for the rest.
          </p>
        </div>
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
                <th scope="col" className="pinned stat avg">
                  AVG
                </th>
                <th scope="col" className="pinned stat obp">
                  OBP
                </th>
                <th scope="col" className="pinned stat slg">
                  SLG
                </th>
                <th scope="col" className="pinned stat ops">
                  OPS
                </th>
                <th scope="col" className="pinned stat runs">
                  R
                </th>
                <th scope="col" className="pinned stat hits">
                  H
                </th>
                <th scope="col" className="pinned stat doubles">
                  2B
                </th>
                <th scope="col" className="pinned stat triples">
                  3B
                </th>
                <th scope="col" className="pinned stat home-runs">
                  HR
                </th>
                <th scope="col" className="pinned stat rbi">
                  RBI
                </th>
                <th scope="col" className="pinned stat base-on-balls">
                  BB
                </th>
                <th scope="col" className="pinned stat strikeouts">
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
                  {averages.avg.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string obp">
                  {averages.obp.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string slg">
                  {averages.slg.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string ops">
                  {averages.ops.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat number runs">
                  {averages.runs.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number hits">
                  {averages.hits.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number doubles">
                  {averages.doubles.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number triples">
                  {averages.triples.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number home-runs">
                  {averages.homeRuns.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number rbi">
                  {averages.rbi.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number base-on-balls">
                  {averages.baseOnBalls.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number strikeouts">
                  {averages.strikeOuts.toFixed(2)}
                </th>
              </tr>
            </thead>
            <tbody>
              {qualifiedHitters.map((hitter, i) => (
                <HittersRow
                  hitter={hitter}
                  averages={averages}
                  extremes={extremes}
                  key={hitter.player.id}
                  i={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}
