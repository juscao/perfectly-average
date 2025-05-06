import { useState, useEffect } from "react";
import {
  calculateHitterBackgroundOpacities,
  calculateHitterNormalizedStats,
} from "../../utils/hittersCalculations";
import {
  Hitter,
  HitterAverages,
  HitterExtremes,
} from "../../types/hitting.types";
import { TeamNameAbbreviations, TeamColors } from "../../types/teams.types";
import { images } from "../../assets/images";

export function HittersRow({
  hitter,
  averages,
  extremes,
  qualified,
  awards,
  i,
  last,
  isLastRowLoaded,
}: {
  hitter: Hitter;
  averages: HitterAverages;
  extremes: HitterExtremes;
  qualified: boolean;
  awards: { name: string; playerId: number }[];
  i: number;
  last: boolean;
  isLastRowLoaded: () => void;
}) {
  const [normalizedStats, setNormalizedStats] = useState<HitterAverages>();
  const [backgroundOpacities, setBackgroundOpacities] =
    useState<HitterAverages>();

  useEffect(() => {
    const getNormalizedStats = () => {
      const response = calculateHitterNormalizedStats(hitter, averages);
      setNormalizedStats(response);
    };
    const getBackgroundOpacities = () => {
      const response = calculateHitterBackgroundOpacities(
        hitter,
        averages,
        extremes
      );
      setBackgroundOpacities(response);
    };
    getNormalizedStats();
    getBackgroundOpacities();
  }, [hitter, averages, extremes]);

  useEffect(() => {
    if (last) {
      isLastRowLoaded();
    }
  }, [last, isLastRowLoaded]);

  if (normalizedStats && backgroundOpacities)
    return (
      <tr>
        <th className="pinned rank">{i + 1}</th>
        <th className="pinned name">
          <div>
            <span>
              {qualified
                ? hitter.player.lastName.toUpperCase()
                : hitter.player.lastName}
              ,{" "}
              {qualified
                ? hitter.player.firstName.toUpperCase()
                : hitter.player.firstName}
            </span>
            <div className="awards">
              {awards.some(
                (award) => award.name === "ALMVP" || award.name === "NLMVP"
              ) && <img src={images.crown} />}

              {awards.some((award) => award.name === "MLBAFIRST") && (
                <img src={images.one} />
              )}
              {awards.some((award) => award.name === "MLBSECOND") && (
                <img src={images.two} />
              )}
              {awards.some(
                (award) => award.name === "ALSS" || award.name === "NLSS"
              ) && <img src={images.bat} className="ss" />}
              {awards.some(
                (award) => award.name === "ALAS" || award.name === "NLAS"
              ) && <img src={images.star} className="as" />}
              {awards.some(
                (award) => award.name === "ALROY" || award.name === "NLROY"
              ) && <img src={images.r} className="roy" />}
            </div>
          </div>
        </th>
        <th className="pinned position">
          {qualified
            ? hitter.position.abbreviation
            : hitter.position.abbreviation.toLowerCase()}
        </th>
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
                    1.5 * backgroundOpacities.avg
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.avg
                  })`,
                  color:
                    1.5 * backgroundOpacities.avg > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.avg)}
        </td>
        <td
          className="stat obp"
          style={
            normalizedStats.obp === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.obp > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.obp
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.obp
                  })`,
                  color:
                    1.5 * backgroundOpacities.obp > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.obp)}
        </td>
        <td
          className="stat slg"
          style={
            normalizedStats.slg === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.slg > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.slg
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.slg
                  })`,
                  color:
                    1.5 * backgroundOpacities.slg > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.slg)}
        </td>
        <td
          className="stat ops"
          style={
            normalizedStats.ops === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.ops > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.ops
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.ops
                  })`,
                  color:
                    1.5 * backgroundOpacities.ops > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.ops)}
        </td>
        <td
          className="stat runs"
          style={
            normalizedStats.runs === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.runs > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.runs
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.runs
                  })`,
                  color:
                    1.5 * backgroundOpacities.runs > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.runs)}
        </td>
        <td
          className="stat hits"
          style={
            normalizedStats.hits === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.hits > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.hits
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.hits
                  })`,
                  color:
                    1.5 * backgroundOpacities.hits > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.hits)}
        </td>
        <td
          className="stat doubles"
          style={
            normalizedStats.doubles === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.doubles > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.doubles
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.doubles
                  })`,
                  color:
                    1.5 * backgroundOpacities.doubles > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.doubles)}
        </td>
        <td
          className="stat triples"
          style={
            normalizedStats.triples === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.triples > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.triples
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.triples
                  })`,
                  color:
                    1.5 * backgroundOpacities.triples > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.triples)}
        </td>
        <td
          className="stat home-runs"
          style={
            normalizedStats.homeRuns === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.homeRuns > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.homeRuns
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.homeRuns
                  })`,
                  color:
                    1.5 * backgroundOpacities.homeRuns > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.homeRuns)}
        </td>
        <td
          className="stat rbi"
          style={
            normalizedStats.rbi === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.rbi > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.rbi
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.rbi
                  })`,
                  color:
                    1.5 * backgroundOpacities.rbi > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.rbi)}
        </td>
        <td
          className="stat base-on-balls"
          style={
            normalizedStats.baseOnBalls === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.baseOnBalls > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.baseOnBalls
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.baseOnBalls
                  })`,
                  color:
                    1.5 * backgroundOpacities.baseOnBalls > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.baseOnBalls)}
        </td>
        <td
          className="stat strikeouts"
          style={
            normalizedStats.strikeOuts === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.strikeOuts > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.strikeOuts
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.strikeOuts
                  })`,
                  color:
                    1.5 * backgroundOpacities.strikeOuts > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.strikeOuts) ||
          normalizedStats.strikeOuts === Infinity
            ? "-"
            : Math.round(normalizedStats.strikeOuts)}
        </td>
      </tr>
    );
}
