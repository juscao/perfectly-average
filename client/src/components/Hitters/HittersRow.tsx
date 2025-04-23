import { useState, useEffect } from "react";
import {
  calculateBackgroundOpacities,
  calculateNormalizedStats,
} from "../../utils/hittersCalculations";
import {
  Hitter,
  HitterAverages,
  HitterExtremes,
} from "../../types/hitting.types";
import { TeamNameAbbreviations, TeamColors } from "../../types/teams.types";

export function HittersRow({
  hitter,
  averages,
  extremes,
  i,
}: {
  hitter: Hitter;
  averages: HitterAverages;
  extremes: HitterExtremes;
  key: number;
  i: number;
}) {
  const [normalizedStats, setNormalizedStats] = useState<HitterAverages>();
  const [backgroundOpacities, setBackgroundOpacities] =
    useState<HitterAverages>();

  useEffect(() => {
    const getNormalizedStats = () => {
      const response = calculateNormalizedStats(hitter, averages);
      setNormalizedStats(response);
    };
    const getBackgroundOpacities = () => {
      const response = calculateBackgroundOpacities(hitter, averages, extremes);
      setBackgroundOpacities(response);
    };
    getNormalizedStats();
    getBackgroundOpacities();
  }, [hitter, averages, extremes]);

  if (normalizedStats && backgroundOpacities)
    return (
      <tr>
        <th className="pinned rank">{i + 1}</th>
        <th className="pinned name">
          {hitter.player.lastName}, {hitter.player.firstName}
        </th>
        <th className="pinned position">{hitter.position.abbreviation}</th>
        <th
          className="pinned team"
          style={{
            backgroundColor: `${TeamColors[hitter.team.name].background}`,
            color: `${TeamColors[hitter.team.name].text}`,
          }}
        >
          {TeamNameAbbreviations[hitter.team.name]}
        </th>
        <td
          className="stat avg"
          style={
            normalizedStats.avg === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.avg > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.avg
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.avg
                  })`,
                  color:
                    2 * backgroundOpacities.avg > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.avg}
        </td>
        <td
          className="stat obp"
          style={
            normalizedStats.obp === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.obp > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.obp
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.obp
                  })`,
                  color:
                    2 * backgroundOpacities.obp > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.obp}
        </td>
        <td
          className="stat slg"
          style={
            normalizedStats.slg === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.slg > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.slg
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.slg
                  })`,
                  color:
                    2 * backgroundOpacities.slg > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.slg}
        </td>
        <td
          className="stat ops"
          style={
            normalizedStats.ops === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.ops > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.ops
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.ops
                  })`,
                  color:
                    2 * backgroundOpacities.ops > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.ops}
        </td>
        <td
          className="stat runs"
          style={
            normalizedStats.runs === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.runs > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.runs
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.runs
                  })`,
                  color:
                    2 * backgroundOpacities.runs > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.runs}
        </td>
        <td
          className="stat hits"
          style={
            normalizedStats.hits === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.hits > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.hits
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.hits
                  })`,
                  color:
                    2 * backgroundOpacities.hits > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.hits}
        </td>
        <td
          className="stat doubles"
          style={
            normalizedStats.doubles === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.doubles > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.doubles
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.doubles
                  })`,
                  color:
                    2 * backgroundOpacities.doubles > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {normalizedStats.doubles}
        </td>
        <td
          className="stat triples"
          style={
            normalizedStats.triples === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.triples > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.triples
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.triples
                  })`,
                  color:
                    2 * backgroundOpacities.triples > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {normalizedStats.triples}
        </td>
        <td
          className="stat home-runs"
          style={
            normalizedStats.homeRuns === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.homeRuns > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.homeRuns
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.homeRuns
                  })`,
                  color:
                    2 * backgroundOpacities.homeRuns > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {normalizedStats.homeRuns}
        </td>
        <td
          className="stat rbi"
          style={
            normalizedStats.rbi === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.rbi > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.rbi
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.rbi
                  })`,
                  color:
                    2 * backgroundOpacities.rbi > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {normalizedStats.rbi}
        </td>
        <td
          className="stat base-on-balls"
          style={
            normalizedStats.baseOnBalls === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.baseOnBalls > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.baseOnBalls
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.baseOnBalls
                  })`,
                  color:
                    2 * backgroundOpacities.baseOnBalls > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {normalizedStats.baseOnBalls}
        </td>
        <td
          className="stat strikeouts"
          style={
            normalizedStats.strikeOuts === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.strikeOuts > 100
              ? {
                  backgroundColor: `rgba(0, 0, 255, ${
                    2 * backgroundOpacities.strikeOuts
                  })`,
                  color:
                    2 * backgroundOpacities.strikeOuts > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
              : {
                  backgroundColor: `rgba(255, 0, 0, ${
                    2 * backgroundOpacities.strikeOuts
                  })`,
                }
          }
        >
          {normalizedStats.strikeOuts}
        </td>
      </tr>
    );
}
