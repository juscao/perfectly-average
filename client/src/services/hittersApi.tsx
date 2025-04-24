import { Hitter } from "../types/hitting.types";

export async function fetchQualifiedHitters(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&group=hitting&season=${season}&sortBy=initLastName&order=asc&limit=10000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.stats[0].splits.filter(
        (player: Hitter) => player.stat.atBats > 0
      );
    }
  } catch (error) {
    console.error("Error fetching qualified hitters:", error);
    return null;
  }
}

export async function fetchAllHitters(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&playerPool=all&group=hitting&season=${season}&sortBy=initLastName&order=asc&limit=10000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.stats[0].splits.filter(
        (player: Hitter) =>
          player.position.abbreviation !== "P" && player.stat.atBats > 0
      );
    }
  } catch (error) {
    console.error("Error fetching all hitters:", error);
    return null;
  }
}
