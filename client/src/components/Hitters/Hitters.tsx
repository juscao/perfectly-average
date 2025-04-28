import { useState, useEffect, useMemo } from "react";
import { HittersRow } from "./HittersRow";
import {
  fetchAllHitters,
  fetchHitterAwards,
  fetchQualifiedHitters,
} from "../../services/hittersApi";
import {
  calculateHitterAverages,
  calculateHitterExtremes,
  sortHittersByStat,
  calculateMostAverageHitter,
} from "../../utils/hittersCalculations";
import {
  Hitter,
  HitterAverages,
  HitterExtremes,
} from "../../types/hitting.types";
import arrow from "../../assets/images/arrow.svg";
import crown from "../../assets/images/crown.svg";
import one from "../../assets/images/one.svg";
import two from "../../assets/images/two.svg";
import bat from "../../assets/images/bat.svg";
import star from "../../assets/images/star.svg";
import r from "../../assets/images/r.svg";
import "./Hitters.css";

export default function Hitters() {
  const [fetching, setFetching] = useState(true);
  const [filters, setFilters] = useState({
    dataset: "qualified",
    team: "all",
    position: "all",
    year: 2025,
  });
  const [allHitters, setAllHitters] = useState<Hitter[]>([]);
  const [qualifiedHitters, setQualifiedHitters] = useState<Hitter[]>([]);
  const [qualifiedHittersIds, setQualifiedHittersIds] = useState<number[]>([]);
  const [averagesAll, setAveragesAll] = useState<HitterAverages | undefined>();
  const [averagesQualified, setAveragesQualified] = useState<
    HitterAverages | undefined
  >();
  const [extremesAll, setExtremesAll] = useState<HitterExtremes | undefined>();
  const [extremesQualified, setExtremesQualified] = useState<
    HitterExtremes | undefined
  >();
  const [awards, setAwards] = useState<{ name: string; playerId: number }[]>(
    []
  );
  const [sortMethod, setSortMethod] = useState<{
    stat: keyof HitterAverages | "name";
    filterMethod: "highToLow" | "lowToHigh" | "A-Z" | "Z-A";
  }>({ stat: "name", filterMethod: "A-Z" });

  useEffect(() => {
    const getHitters = async () => {
      const responseAll = await fetchAllHitters(filters.year);
      const responseQualified = await fetchQualifiedHitters(filters.year);
      if (responseAll) {
        const hitterAverages = calculateHitterAverages(responseAll);
        setAveragesAll(hitterAverages);
        const hitterExtremes = calculateHitterExtremes(responseAll);
        setExtremesAll(hitterExtremes);
        const sortedData: Hitter[] = [...responseAll].sort((a, b) =>
          a.player.lastName.localeCompare(b.player.lastName)
        );
        setAllHitters(sortedData);
      }
      if (responseQualified) {
        const hitterAverages = calculateHitterAverages(responseQualified);
        setAveragesQualified(hitterAverages);
        const hitterExtremes = calculateHitterExtremes(responseQualified);
        setExtremesQualified(hitterExtremes);
        const sortedData: Hitter[] = [...responseQualified].sort((a, b) =>
          a.player.lastName.localeCompare(b.player.lastName)
        );
        setQualifiedHitters(sortedData);
        setQualifiedHittersIds(() =>
          responseQualified.map((hitter: Hitter) => hitter.player.id)
        );
      }
      setFetching(false);
    };
    const getAwards = async () => {
      if (filters.year < 2025) {
        const response = await fetchHitterAwards(filters.year);
        if (response) {
          return setAwards(response);
        }
      }
      setAwards([]);
    };
    getHitters();
    getAwards();
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

  const filteredAndSortedHitters = useMemo(() => {
    let result =
      filters.dataset === "qualified" ? qualifiedHitters : allHitters;

    if (filters.team !== "all") {
      if (filters.team === "al") {
        result = result.filter((hitter) => hitter.league.name === "AL");
      } else if (filters.team === "nl") {
        result = result.filter((hitter) => hitter.league.name === "NL");
      } else {
        const teamName = filters.team
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        result = result.filter((hitter) => hitter.team.name === teamName);
      }
    }

    if (filters.position !== "all") {
      result = result.filter(
        (hitter) =>
          hitter.position.abbreviation.toLowerCase() === filters.position
      );
    }

    if (
      sortMethod.stat !== "name" &&
      sortMethod.filterMethod !== "A-Z" &&
      sortMethod.filterMethod !== "Z-A"
    ) {
      const sorted = sortHittersByStat(
        result,
        sortMethod.stat,
        sortMethod.filterMethod
      );
      return sorted.filter((hitter): hitter is Hitter => hitter !== undefined);
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
  }, [filters, sortMethod, allHitters, qualifiedHitters]);

  if (
    !fetching &&
    averagesQualified &&
    averagesAll &&
    extremesQualified &&
    extremesAll
  )
    return (
      <div className="wrapper">
        <h1 onClick={() => fetchHitterAwards(2022)}>{filters.year} Hitters</h1>
        <div className="description">
          <ul>
            <li>
              A score of 100 is average. A score of 150, for example, is 50%
              above average. Red is good and blue is bad. For SO, lower is
              better. Higher is better for the rest.
            </li>
            <li>
              R, H, 2B, 3B, HR, RBI, BB, and SO averages are calculated per 100
              PA (e.g., on average, a{" "}
              {filters.dataset === "qualified" && "qualified"} hitter{" "}
              {filters.year < new Date().getFullYear() && `in ${filters.year}`}{" "}
              {filters.year === new Date().getFullYear() ? "will have" : "had"}{" "}
              <strong>
                {filters.dataset === "qualified"
                  ? averagesQualified.hits.toFixed(2)
                  : averagesAll.hits.toFixed(2)}
              </strong>{" "}
              hits per 100 PA).
            </li>

            <li>
              Only players with at least one official at-bat are included.
              Qualified players have their name and position in CAPS.
            </li>
            <li>
              Out of all {filters.dataset === "qualified" && "qualified"}{" "}
              hitters in {filters.year}, the most perfectly average{" "}
              {filters.year === new Date().getFullYear()
                ? "is currently"
                : "was"}{" "}
              <strong>
                {filters.dataset === "qualified"
                  ? calculateMostAverageHitter(
                      qualifiedHitters,
                      averagesQualified
                    ).name
                  : calculateMostAverageHitter(allHitters, averagesAll).name}
              </strong>{" "}
              with an average absolute deviation of{" "}
              <strong>
                {filters.dataset === "qualified"
                  ? calculateMostAverageHitter(
                      qualifiedHitters,
                      averagesQualified
                    ).averageAbsoluteDeviation.toFixed(2)
                  : calculateMostAverageHitter(
                      allHitters,
                      averagesAll
                    ).averageAbsoluteDeviation.toFixed(2)}
              </strong>
              .
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
              {[...new Set(allHitters.map((hitter) => hitter.team.name))]
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
            <label htmlFor="position">Position:</label>
            <select
              name="position"
              id="position"
              value={filters.position}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="p">P</option>
              <option value="c">C</option>
              <option value="1b">1B</option>
              <option value="2b">2B</option>
              <option value="3b">3B</option>
              <option value="ss">SS</option>
              <option value="lf">LF</option>
              <option value="cf">CF</option>
              <option value="rf">RF</option>
              <option value="dh">DH</option>
              <option value="x">X</option>
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
        <div id="table-container">
          <table id="hitting-table">
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
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "A-Z"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                  </button>
                </th>
                <th scope="col" className="pinned double-pinned position">
                  Pos
                </th>
                <th scope="col" className="pinned double-pinned team">
                  Team
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
                        src={arrow}
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
                <th scope="col" className="pinned stat obp">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "obp"
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
                            stat: "obp",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "obp" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>OBP</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat slg">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "slg"
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
                            stat: "slg",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "slg" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>SLG</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat ops">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "ops"
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
                            stat: "ops",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "ops" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>OPS</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat runs">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "runs"
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
                            stat: "runs",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "runs" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>R</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat hits">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "hits"
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
                            stat: "hits",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "hits" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>H</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat doubles">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "doubles"
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
                            stat: "doubles",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "doubles" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>2B</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat triples">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "triples"
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
                            stat: "triples",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "triples" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>3B</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat home-runs">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "homeRuns"
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
                            stat: "homeRuns",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "homeRuns" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>HR</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat rbi">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "rbi"
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
                            stat: "rbi",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "rbi" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>RBI</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat base-on-balls">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "baseOnBalls"
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
                            stat: "baseOnBalls",
                            filterMethod: "highToLow",
                          }));
                    }}
                  >
                    {sortMethod.stat === "baseOnBalls" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "highToLow"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>BB</span>
                  </button>
                </th>
                <th scope="col" className="pinned stat strikeouts">
                  <button
                    type="button"
                    onClick={() => {
                      return sortMethod.stat === "strikeOuts"
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
                            stat: "strikeOuts",
                            filterMethod: "lowToHigh",
                          }));
                    }}
                  >
                    {sortMethod.stat === "strikeOuts" && (
                      <img
                        src={arrow}
                        style={
                          sortMethod.filterMethod === "lowToHigh"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    )}
                    <span>SO</span>
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
                <th scope="col" className="pinned stat string avg">
                  {filters.dataset === "qualified"
                    ? averagesQualified.avg.toFixed(3).replace(/^0\./, ".")
                    : averagesAll.avg.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string obp">
                  {filters.dataset === "qualified"
                    ? averagesQualified.obp.toFixed(3).replace(/^0\./, ".")
                    : averagesAll.obp.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string slg">
                  {filters.dataset === "qualified"
                    ? averagesQualified.slg.toFixed(3).replace(/^0\./, ".")
                    : averagesAll.slg.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat string ops">
                  {filters.dataset === "qualified"
                    ? averagesQualified.ops.toFixed(3).replace(/^0\./, ".")
                    : averagesAll.ops.toFixed(3).replace(/^0\./, ".")}
                </th>
                <th scope="col" className="pinned stat number runs">
                  {filters.dataset === "qualified"
                    ? averagesQualified.runs.toFixed(2)
                    : averagesAll.runs.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number hits">
                  {filters.dataset === "qualified"
                    ? averagesQualified.hits.toFixed(2)
                    : averagesAll.hits.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number doubles">
                  {filters.dataset === "qualified"
                    ? averagesQualified.doubles.toFixed(2)
                    : averagesAll.doubles.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number triples">
                  {filters.dataset === "qualified"
                    ? averagesQualified.triples.toFixed(2)
                    : averagesAll.triples.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number home-runs">
                  {filters.dataset === "qualified"
                    ? averagesQualified.homeRuns.toFixed(2)
                    : averagesAll.homeRuns.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number rbi">
                  {filters.dataset === "qualified"
                    ? averagesQualified.rbi.toFixed(2)
                    : averagesAll.rbi.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number base-on-balls">
                  {filters.dataset === "qualified"
                    ? averagesQualified.baseOnBalls.toFixed(2)
                    : averagesAll.baseOnBalls.toFixed(2)}
                </th>
                <th scope="col" className="pinned stat number strikeouts">
                  {filters.dataset === "qualified"
                    ? averagesQualified.strikeOuts.toFixed(2)
                    : averagesAll.strikeOuts.toFixed(2)}
                </th>
              </tr>
            </thead>
            {filteredAndSortedHitters &&
              filteredAndSortedHitters.length > 0 && (
                <tbody>
                  {filteredAndSortedHitters.map((hitter, i) => (
                    <HittersRow
                      hitter={hitter}
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
                      qualified={qualifiedHittersIds.includes(hitter.player.id)}
                      awards={awards.filter(
                        (award) => award.playerId === hitter.player.id
                      )}
                      i={i}
                      key={hitter.player.id}
                    />
                  ))}
                </tbody>
              )}
          </table>
        </div>
        {filters.year < 2025 && (
          <div id="hitters-legend">
            <div>
              <img src={crown} />
              <span>MVP</span>
            </div>
            <div>
              <img src={one} />
              <span>All-MLB First Team</span>
            </div>
            <div>
              <img src={two} />
              <span>All-MLB Second Team</span>
            </div>
            <div>
              <img src={bat} />
              <span>Silver Slugger</span>
            </div>
            <div>
              <img src={star} />
              <span>All-Star</span>
            </div>
            <div>
              <img src={r} />
              <span>Rookie of the Year</span>
            </div>
          </div>
        )}
      </div>
    );
}
