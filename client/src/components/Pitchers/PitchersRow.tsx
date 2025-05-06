import { useState, useEffect } from "react";
import { fetchPitcherThrowingHand } from "../../services/pitchersApi";
import {
  calculatePitcherBackgroundOpacities,
  calculatePitcherNormalizedStats,
} from "../../utils/pitchersCalculations";
import {
  Pitcher,
  PitcherAverages,
  PitcherExtremes,
} from "../../types/pitching.types";
import { TeamNameAbbreviations, TeamColors } from "../../types/teams.types";
import { images } from "../../assets/images";

export function PitchersRow({
  pitcher,
  handFilter,
  averages,
  extremes,
  qualified,
  awards,
  i,
  last,
  isLastRowLoaded,
}: {
  pitcher: Pitcher;
  handFilter: string;
  averages: PitcherAverages;
  extremes: PitcherExtremes;
  qualified: boolean;
  awards: { name: string; playerId: number }[];
  i: number;
  last: boolean;
  isLastRowLoaded: () => void;
}) {
  const [fetching, setFetching] = useState(true);
  const [normalizedStats, setNormalizedStats] = useState<PitcherAverages>();
  const [backgroundOpacities, setBackgroundOpacities] =
    useState<PitcherAverages>();
  const [throwingHand, setThrowingHand] = useState<"L" | "R" | undefined>();

  useEffect(() => {
    if (pitcher) {
      const getThrowingHand = async () => {
        const response = await fetchPitcherThrowingHand(pitcher.player.id);
        if (response) {
          setThrowingHand(response);
        }
        setFetching(false);
      };
      getThrowingHand();
    }
  }, [pitcher]);

  useEffect(() => {
    if (!fetching && last) {
      isLastRowLoaded();
    }
  }, [fetching, last, isLastRowLoaded]);

  useEffect(() => {
    const getNormalizedStats = () => {
      const response = calculatePitcherNormalizedStats(pitcher, averages);
      if (response) setNormalizedStats(response);
    };
    const getBackgroundOpacities = () => {
      const response = calculatePitcherBackgroundOpacities(
        pitcher,
        averages,
        extremes
      );
      if (response) setBackgroundOpacities(response);
    };
    getNormalizedStats();
    getBackgroundOpacities();
  }, [pitcher, averages, extremes]);

  if (
    ((!fetching && handFilter === "all") || handFilter === throwingHand) &&
    normalizedStats &&
    backgroundOpacities
  )
    return (
      <tr>
        <th className="pinned rank">{i + 1}</th>
        <th className="pinned name">
          <div>
            <span>
              {qualified
                ? pitcher.player.lastName.toUpperCase()
                : pitcher.player.lastName}
              ,{" "}
              {qualified
                ? pitcher.player.firstName.toUpperCase()
                : pitcher.player.firstName}
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
                (award) =>
                  award.name === "ALCY" ||
                  award.name === "NLCY" ||
                  award.name === "MLBCY"
              ) && <img src={images.ball} className="ss" />}
              {awards.some(
                (award) => award.name === "ALAS" || award.name === "NLAS"
              ) && <img src={images.star} className="as" />}
              {awards.some(
                (award) => award.name === "ALROY" || award.name === "NLROY"
              ) && <img src={images.r} className="roy" />}
            </div>
          </div>
        </th>
        {throwingHand && (
          <th className="pinned position">
            {qualified
              ? throwingHand.toUpperCase() + "HP"
              : throwingHand.toLowerCase() + "hp"}
          </th>
        )}
        <th
          className="pinned team"
          style={{
            backgroundColor: `${TeamColors[pitcher.team.name].background}`,
            color: `${TeamColors[pitcher.team.name].text}`,
          }}
        >
          {TeamNameAbbreviations[pitcher.team.name]}
        </th>
        <td
          className="stat era"
          style={
            normalizedStats.era === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.era > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.era
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.era
                  })`,
                  color:
                    1.5 * backgroundOpacities.era > 0.6 ? "#ffffff" : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.era) || normalizedStats.era === Infinity
            ? "-"
            : Math.round(normalizedStats.era)}
        </td>
        <td
          className="stat whip"
          style={
            normalizedStats.whip === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.whip > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.whip
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.whip
                  })`,
                  color:
                    1.5 * backgroundOpacities.whip > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.whip) || normalizedStats.whip === Infinity
            ? "-"
            : Math.round(normalizedStats.whip)}
        </td>
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
          {isNaN(normalizedStats.avg) || normalizedStats.avg === Infinity
            ? "-"
            : Math.round(normalizedStats.avg)}
        </td>
        <td
          className="stat ip-per-game"
          style={
            normalizedStats.innPerGame === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.innPerGame > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.innPerGame
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.innPerGame
                  })`,
                  color:
                    1.5 * backgroundOpacities.innPerGame > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {Math.round(normalizedStats.innPerGame)}
        </td>
        <td
          className="stat k-per-9"
          style={
            normalizedStats.strikeOutsPer9Inn === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.strikeOutsPer9Inn > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.strikeOutsPer9Inn
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.strikeOutsPer9Inn
                  })`,
                  color:
                    1.5 * backgroundOpacities.strikeOutsPer9Inn > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.strikeOutsPer9Inn) ||
          normalizedStats.strikeOutsPer9Inn === Infinity
            ? "-"
            : Math.round(normalizedStats.strikeOutsPer9Inn)}
        </td>
        <td
          className="stat bb-per-9"
          style={
            normalizedStats.walksPer9Inn === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.walksPer9Inn > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.walksPer9Inn
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.walksPer9Inn
                  })`,
                  color:
                    1.5 * backgroundOpacities.walksPer9Inn > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.walksPer9Inn) ||
          normalizedStats.walksPer9Inn === Infinity
            ? "-"
            : Math.round(normalizedStats.walksPer9Inn)}
        </td>
        <td
          className="stat h-per-9"
          style={
            normalizedStats.hitsPer9Inn === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.hitsPer9Inn > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.hitsPer9Inn
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.hitsPer9Inn
                  })`,
                  color:
                    1.5 * backgroundOpacities.hitsPer9Inn > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.hitsPer9Inn) ||
          normalizedStats.hitsPer9Inn === Infinity
            ? "-"
            : Math.round(normalizedStats.hitsPer9Inn)}
        </td>
        <td
          className="stat hr-per-9"
          style={
            normalizedStats.homeRunsPer9 === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.homeRunsPer9 > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.homeRunsPer9
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.homeRunsPer9
                  })`,
                  color:
                    1.5 * backgroundOpacities.homeRunsPer9 > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.homeRunsPer9) ||
          normalizedStats.homeRunsPer9 === Infinity
            ? "-"
            : Math.round(normalizedStats.homeRunsPer9)}
        </td>
        <td
          className="stat k-bb-ratio"
          style={
            normalizedStats.strikeoutWalkRatio === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.strikeoutWalkRatio > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.strikeoutWalkRatio
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.strikeoutWalkRatio
                  })`,
                  color:
                    1.5 * backgroundOpacities.strikeoutWalkRatio > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.strikeoutWalkRatio) ||
          normalizedStats.strikeoutWalkRatio === Infinity
            ? "-"
            : Math.round(normalizedStats.strikeoutWalkRatio)}
        </td>
        <td
          className="stat go-to-ao"
          style={
            normalizedStats.groundOutsToAirouts === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.groundOutsToAirouts > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.groundOutsToAirouts
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.groundOutsToAirouts
                  })`,
                  color:
                    1.5 * backgroundOpacities.groundOutsToAirouts > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.groundOutsToAirouts) ||
          normalizedStats.groundOutsToAirouts === Infinity
            ? "-"
            : Math.round(normalizedStats.groundOutsToAirouts)}
        </td>
        <td
          className="stat strike-ball-ratio"
          style={
            normalizedStats.strikeBallRatio === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.strikeBallRatio > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.strikeBallRatio
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.strikeBallRatio
                  })`,
                  color:
                    1.5 * backgroundOpacities.strikeBallRatio > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.strikeBallRatio) ||
          normalizedStats.strikeBallRatio === Infinity
            ? "-"
            : Math.round(normalizedStats.strikeBallRatio)}
        </td>
        <td
          className="stat pitches-per-9"
          style={
            normalizedStats.pitchesPer9Inn === 100
              ? { backgroundColor: "#ffffff" }
              : normalizedStats.pitchesPer9Inn > 100
              ? {
                  backgroundColor: `rgba(255, 0, 0, ${
                    1.5 * backgroundOpacities.pitchesPer9Inn
                  })`,
                }
              : {
                  backgroundColor: `rgba(0, 0, 255, ${
                    1.5 * backgroundOpacities.pitchesPer9Inn
                  })`,
                  color:
                    1.5 * backgroundOpacities.pitchesPer9Inn > 0.6
                      ? "#ffffff"
                      : "#000000",
                }
          }
        >
          {isNaN(normalizedStats.pitchesPer9Inn) ||
          normalizedStats.pitchesPer9Inn === Infinity
            ? "-"
            : Math.round(normalizedStats.pitchesPer9Inn)}
        </td>
      </tr>
    );
}
