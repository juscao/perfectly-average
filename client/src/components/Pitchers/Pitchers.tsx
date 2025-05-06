import { useState, useEffect, useMemo } from "react";
import { PitchersRow } from "./PitchersRow";
import {
  fetchAllPitchers,
  fetchQualifiedPitchers,
  fetchPitcherAwards,
} from "../../services/pitchersApi";
import {
  calculatePitcherAverages,
  calculatePitcherExtremes,
  sortPitchersByStat,
  calculateMostAveragePitcher,
} from "../../utils/pitchersCalculations";
import {
  Pitcher,
  PitcherAverages,
  PitcherExtremes,
} from "../../types/pitching.types";
import { images } from "../../assets/images";
import "../../assets/css/tables.css";

export default function Pitchers() {
  const [fetching, setFetching] = useState(true);
  const [filters, setFilters] = useState({
    dataset: "qualified",
    team: "all",
    position: "all",
    year: 2025,
    hand: "all",
  });
  const [allPitchers, setAllPitchers] = useState<Pitcher[]>([]);
  const [qualifiedPitchers, setQualifiedPitchers] = useState<Pitcher[]>([]);
  const [qualifiedPitchersIds, setQualifiedPitchersIds] = useState<number[]>(
    []
  );
  const [averagesAll, setAveragesAll] = useState<PitcherAverages | undefined>();
  const [averagesQualified, setAveragesQualified] = useState<
    PitcherAverages | undefined
  >();
  const [extremesAll, setExtremesAll] = useState<PitcherExtremes | undefined>();
  const [extremesQualified, setExtremesQualified] = useState<
    PitcherExtremes | undefined
  >();
  const [awards, setAwards] = useState<{ name: string; playerId: number }[]>(
    []
  );
  const [sortMethod, setSortMethod] = useState<{
    stat: keyof PitcherAverages | "name";
    filterMethod: "highToLow" | "lowToHigh" | "A-Z" | "Z-A";
  }>({ stat: "name", filterMethod: "A-Z" });
  const [lastRowLoaded, setLastRowLoaded] = useState(false);

  useEffect(() => {
    setLastRowLoaded(false);
    const getPitchers = async () => {
      const responseAll = await fetchAllPitchers(filters.year);
      const responseQualified = await fetchQualifiedPitchers(filters.year);

      if (responseAll) {
        const pitcherAverages = calculatePitcherAverages(responseAll);
        setAveragesAll(pitcherAverages);
        const pitcherExtremes = calculatePitcherExtremes(responseAll);
        setExtremesAll(pitcherExtremes);
        const sortedData = [...responseAll].sort((a, b) =>
          a.player.lastName.localeCompare(b.player.lastName)
        );
        setAllPitchers(sortedData);
      }

      if (responseQualified) {
        const pitcherAverages = calculatePitcherAverages(responseQualified);
        setAveragesQualified(pitcherAverages);
        const pitcherExtremes = calculatePitcherExtremes(responseQualified);
        setExtremesQualified(pitcherExtremes);
        const sortedData = [...responseQualified].sort((a, b) =>
          a.player.lastName.localeCompare(b.player.lastName)
        );
        setQualifiedPitchers(sortedData);
        setQualifiedPitchersIds(() =>
          responseQualified.map((pitcher: Pitcher) => pitcher.player.id)
        );
      }
    };

    const getAwards = async () => {
      if (filters.year < 2025) {
        const response = await fetchPitcherAwards(filters.year);
        if (response) {
          return setAwards(response);
        }
      }
      setAwards([]);
    };

    const fetchAll = async () => {
      setFetching(true);
      await getPitchers();
      await getAwards();
      setFetching(false);
    };
    fetchAll();
  }, [filters.year]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "year") {
      return setFilters((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
    return setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredAndSortedPitchers = useMemo(() => {
    let result =
      filters.dataset === "qualified" ? qualifiedPitchers : allPitchers;

    if (filters.team !== "all") {
      if (filters.team === "al") {
        result = result.filter((pitcher) => pitcher.league.name === "AL");
      } else if (filters.team === "nl") {
        result = result.filter((pitcher) => pitcher.league.name === "NL");
      } else {
        const teamName = filters.team
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        result = result.filter((pitcher) => pitcher.team.name === teamName);
      }
    }

    if (filters.position !== "all") {
      result = result.filter(
        (pitcher) =>
          pitcher.position.abbreviation.toLowerCase() === filters.position
      );
    }

    if (
      sortMethod.stat !== "name" &&
      sortMethod.filterMethod !== "A-Z" &&
      sortMethod.filterMethod !== "Z-A"
    ) {
      const sorted = sortPitchersByStat(
        result,
        sortMethod.stat,
        sortMethod.filterMethod
      );
      return sorted.filter(
        (pitcher): pitcher is Pitcher => pitcher !== undefined
      );
    } else if (
      sortMethod.stat === "name" &&
      sortMethod.filterMethod === "A-Z"
    ) {
      return [...result].sort((a, b) =>
        a.player.lastName.localeCompare(b.player.lastName)
      );
    } else if (
      sortMethod.stat === "name" &&
      sortMethod.filterMethod === "Z-A"
    ) {
      return [...result].sort((a, b) =>
        b.player.lastName.localeCompare(a.player.lastName)
      );
    }

    return result;
  }, [filters, sortMethod, allPitchers, qualifiedPitchers]);

  const isLastRowLoaded = () => {
    setLastRowLoaded(true);
  };

  if (fetching) return <div className="fetching-container">Loading...</div>;

  if (
    !fetching &&
    averagesQualified &&
    averagesAll &&
    extremesQualified &&
    extremesAll
  )
    return (
      <div className="wrapper">
        <h1>{filters.year} Pitchers</h1>
        <div className="description">
          <ul>
            <li>
              A score of 100 is average. Red is good and blue is bad. If the
              league ERA is 3.50 and a player's ERA is 1.75, their score would
              be 200 (100% above average). Therefore, a player with an ERA of
              7.00 would have a score of 50 (50% below average).
            </li>
            <li>
              To minimize division by 0, only players with at least 0.1 IP, 1
              air out, 1 BB, and 1 thrown ball are included. Note that prior to
              1974, ground outs, air outs, strikes, and number of pitches are
              not included in the API, so there are no calculations for those
              years. Qualified players have their names and positions in CAPS.
            </li>
            <li>
              Out of all {filters.dataset === "qualified" && "qualified"}{" "}
              pitchers in {filters.year}, the most perfectly average{" "}
              {filters.year === new Date().getFullYear()
                ? "is currently"
                : "was"}{" "}
              <strong>
                {filters.dataset === "qualified"
                  ? calculateMostAveragePitcher(
                      qualifiedPitchers,
                      averagesQualified,
                      filters.year,
                      filters.dataset
                    ).name
                  : calculateMostAveragePitcher(
                      allPitchers,
                      averagesAll,
                      filters.year,
                      filters.dataset
                    ).name}
              </strong>{" "}
              with an average absolute deviation of{" "}
              <strong>
                {filters.dataset === "qualified"
                  ? calculateMostAveragePitcher(
                      qualifiedPitchers,
                      averagesQualified,
                      filters.year,
                      filters.dataset
                    ).averageAbsoluteDeviation.toFixed(2)
                  : calculateMostAveragePitcher(
                      allPitchers,
                      averagesAll,
                      filters.year,
                      filters.dataset
                    ).averageAbsoluteDeviation.toFixed(2)}
              </strong>
              .{" "}
              {filters.dataset === "all" &&
                "IP/G is not included in this calculation."}
            </li>
          </ul>
        </div>
        <div className="filters">
          <div>
            <label htmlFor="dataset">Dataset:</label>
            <select
              name="dataset"
              id="dataset"
              value={filters.dataset}
              onChange={handleFilterChange}
            >
              <option value="qualified">Qualified</option>
              <option value="all">All</option>
            </select>
          </div>
          <div>
            <label htmlFor="year">Hand:</label>
            <select
              name="hand"
              id="hand"
              value={filters.hand}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="L">Left</option>
              <option value="R">Right</option>
            </select>
          </div>
          <div>
            <label htmlFor="dataset">Team:</label>
            <select
              name="team"
              id="team"
              value={filters.team}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="al">AL</option>
              <option value="nl">NL</option>
              {[...new Set(allPitchers.map((pitcher) => pitcher.team.name))]
                .sort((a, b) => a.localeCompare(b))
                .map((teamName) => (
                  <option
                    key={teamName}
                    value={teamName.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {teamName}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <select
              name="year"
              id="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              {Array.from({ length: 2025 - 1951 + 1 }, (_, i) => 2025 - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        {!lastRowLoaded && (
          <div
            id="placeholder"
            style={{
              height: `calc(${filteredAndSortedPitchers.length * 18} + 36)px`,
              maxHeight: "640px",
            }}
          ></div>
        )}
        <div
          id="pitching-table-container"
          style={{
            opacity: lastRowLoaded ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <table>
            <thead>
              <tr className="headings">
                <th scope="col" className="pinned double-pinned rank">
                  Rank
                </th>
                <th scope="col" className="pinned double-pinned name">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "name"
                        ? sortMethod.filterMethod === "A-Z"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "Z-A",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "A-Z",
                            }))
                        : setSortMethod(() => ({
                            stat: "name",
                            filterMethod: "A-Z",
                          }));
                    }}
                  >
                    <span>Name</span>
                    {sortMethod.stat === "name" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "A-Z"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                  </button>
                </th>
                <th scope="col" className="pinned double-pinned pos">
                  Pos
                </th>
                <th scope="col" className="pinned double-pinned team">
                  Team
                </th>
                <th scope="col" className="pinned stat era">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "era"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "era",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "era" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>ERA</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat whip">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "whip"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "whip",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "whip" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>WHIP</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat avg">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "avg"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "avg",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "avg" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>AVG</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat ip-per-game">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "innPerGame"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "innPerGame",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "innPerGame" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>IP/G</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat k-per-9">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "strikeOutsPer9Inn"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "strikeOutsPer9Inn",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "strikeOutsPer9Inn" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>K/9</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat bb-per-9">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "walksPer9Inn"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "walksPer9Inn",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "walksPer9Inn" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>BB/9</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat h-per-9">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "hitsPer9Inn"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "hitsPer9Inn",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "hitsPer9Inn" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>H/9</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat hr-per-9">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "homeRunsPer9"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "homeRunsPer9",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "homeRunsPer9" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>HR/9</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat k-bb-ratio">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "strikeoutWalkRatio"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "strikeoutWalkRatio",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "strikeoutWalkRatio" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>K/BB</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat go-to-ao">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "groundOutsToAirouts"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "groundOutsToAirouts",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "groundOutsToAirouts" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>GO/AO</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat strike-ball-ratio">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "strikeBallRatio"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "strikeBallRatio",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "strikeBallRatio" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>S/B</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat pitches-per-9">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "pitchesPer9Inn"
                        ? sortMethod.filterMethod === "highToLow"
                          ? setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "lowToHigh",
                            }))
                          : setSortMethod((prev) => ({
                              ...prev,
                              filterMethod: "highToLow",
                            }))
                        : setSortMethod(() => ({
                            stat: "pitchesPer9Inn",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "pitchesPer9Inn" && (
                      <img
                        src={images.arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>P/9</span>
                  </button>
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
                <th scope="col" className="pinned stat string era">
                  {filters.dataset === "qualified"
                    ? averagesQualified.era.toFixed(2)
                    : averagesAll.era.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat string whip">
                  {filters.dataset === "qualified"
                    ? averagesQualified.whip.toFixed(2)
                    : averagesAll.whip.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat string avg">
                  {filters.dataset === "qualified"
                    ? averagesQualified.avg.toFixed(3).replace(/^0\./, ".")
                    : averagesAll.avg.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string ip-per-game">
                  {filters.dataset === "qualified"
                    ? averagesQualified.innPerGame
                        .toFixed(2)
                        .replace(/^0\./, ".")
                    : averagesAll.innPerGame.toFixed(2).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat number k-per-9">
                  {filters.dataset === "qualified"
                    ? averagesQualified.strikeOutsPer9Inn.toFixed(2)
                    : averagesAll.strikeOutsPer9Inn.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number bb-per-9">
                  {filters.dataset === "qualified"
                    ? averagesQualified.walksPer9Inn.toFixed(2)
                    : averagesAll.walksPer9Inn.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number h-per-9">
                  {filters.dataset === "qualified"
                    ? averagesQualified.hitsPer9Inn.toFixed(2)
                    : averagesAll.hitsPer9Inn.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number hr-per-9">
                  {filters.dataset === "qualified"
                    ? averagesQualified.homeRunsPer9.toFixed(2)
                    : averagesAll.homeRunsPer9.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number k-bb-ratio">
                  {filters.dataset === "qualified"
                    ? averagesQualified.strikeoutWalkRatio.toFixed(2)
                    : averagesAll.strikeoutWalkRatio.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number go-to-ao">
                  {filters.dataset === "qualified"
                    ? filters.year > 1973
                      ? averagesQualified.groundOutsToAirouts.toFixed(2)
                      : "-"
                    : filters.year > 1973
                    ? averagesAll.groundOutsToAirouts.toFixed(2)
                    : "-"}
                </th>
                <th
                  scope="col"
                  className="pinned stat number strike-ball-ratio"
                >
                  {filters.dataset === "qualified"
                    ? filters.year > 1973
                      ? averagesQualified.strikeBallRatio.toFixed(2)
                      : "-"
                    : filters.year > 1973
                    ? averagesAll.strikeBallRatio.toFixed(2)
                    : "-"}
                </th>
                <th scope="col" className="pinned stat number pitches-per-9">
                  {filters.dataset === "qualified"
                    ? filters.year > 1973
                      ? averagesQualified.pitchesPer9Inn.toFixed(2)
                      : "-"
                    : filters.year > 1973
                    ? averagesAll.pitchesPer9Inn.toFixed(2)
                    : "-"}
                </th>
              </tr>
            </thead>
            {filteredAndSortedPitchers &&
              filteredAndSortedPitchers.length > 0 && (
                <tbody>
                  {filteredAndSortedPitchers.map((pitcher, i) => (
                    <PitchersRow
                      pitcher={pitcher}
                      handFilter={filters.hand}
                      averages={
                        filters.dataset === "qualified"
                          ? averagesQualified
                          : averagesAll
                      }
                      extremes={
                        filters.dataset === "qualified"
                          ? extremesQualified
                          : extremesAll
                      }
                      qualified={qualifiedPitchersIds.includes(
                        pitcher.player.id
                      )}
                      awards={awards.filter(
                        (award) => award.playerId === pitcher.player.id
                      )}
                      i={i}
                      key={pitcher.player.id}
                      last={i === filteredAndSortedPitchers.length - 1}
                      isLastRowLoaded={isLastRowLoaded}
                    />
                  ))}
                </tbody>
              )}
          </table>
        </div>
        {filters.year < 2025 && (
          <div id="pitchers-legend">
            <div>
              <img src={images.crown} />
              <span>MVP</span>
            </div>
            <div>
              <img src={images.one} />
              <span>All-MLB First Team</span>
            </div>
            <div>
              <img src={images.two} />
              <span>All-MLB Second Team</span>
            </div>
            <div>
              <img src={images.ball} />
              <span>Cy Young</span>
            </div>
            <div>
              <img src={images.star} />
              <span>All-Star</span>
            </div>
            <div>
              <img src={images.r} />
              <span>Rookie of the Year</span>
            </div>
          </div>
        )}
      </div>
    );
}
